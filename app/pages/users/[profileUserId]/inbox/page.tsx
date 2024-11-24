"use client"

import { useState, useEffect } from "react"
import io from "socket.io-client"
import axios from "axios"
import useSWR from "swr"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Loader2, Search, MessageSquare } from 'lucide-react'

const fetcher = (url) => axios.get(url).then((res) => res.data)

// Utility function to check if two dates are on the same day
const isSameDay = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

// Component to display the date divider
const DateDivider = ({ date }) => {
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="flex justify-center my-6">
      <Badge variant="secondary" className="text-muted-foreground">
        {formattedDate}
      </Badge>
    </div>
  )
}

export default function InboxPage() {
  const [currentUser] = useState("1")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [socket, setSocket] = useState(null)
  const [activeRoomId, setActiveRoomId] = useState(null)
  const [activeOtherUser, setActiveOtherUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch chat list using SWR
  const {
    data: chatRooms,
    mutate,
    error,
    isLoading,
  } = useSWR(
    currentUser ? `/api/socketIo/${currentUser}/chatList` : null,
    fetcher
  )

  // Set up socket connection
  useEffect(() => {
    if (activeRoomId) {
      const newSocket = io("http://localhost:3001")
      
      newSocket.emit("join_room", activeRoomId)
      setMessages([])

      newSocket.on("previous_messages", (previousMessages) => {
        const sortedMessages = previousMessages.sort(
          (a, b) => new Date(a.createdat) - new Date(b.createdat)
        )
        setMessages(sortedMessages)
      })

      newSocket.on("receive_message", (message) => {
        setMessages((prev) => [...prev, message])
      })

      setSocket(newSocket)

      return () => {
        newSocket.disconnect()
      }
    }
  }, [activeRoomId])

  // Listen for real-time chat list updates
  useEffect(() => {
    if (socket) {
      socket.on("update_chat_list", () => {
        mutate()
      })
    }
  }, [socket, mutate])

  const sendMessage = () => {
    if (!currentUser || !socket || message.trim() === "") return

    const messageData = {
      room: activeRoomId,
      sender_id: currentUser,
      receiver_id: activeOtherUser,
      message,
      time: new Date(),
      createdat: new Date(),
    }

    socket.emit("send_message", messageData)
    setMessages((prev) => [...prev, messageData])
    setMessage("")
  }

  const handleSelectChat = (roomId, otherUserId) => {
    setActiveRoomId(roomId)
    setActiveOtherUser(otherUserId)
    setMessages([])
  }

  const filteredChatRooms = chatRooms?.filter((room) =>
    room.other_user_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error ? error.message : "Error loading chats"}</div>
          ) : filteredChatRooms?.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No conversations found</div>
          ) : (
            <div className="divide-y">
              {filteredChatRooms?.map((room) => (
                <button
                  key={room.room_id}
                  onClick={() => handleSelectChat(room.room_id, room.other_user_id)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                    activeRoomId === room.room_id ? "bg-muted" : ""
                  }`}
                >
                  <Avatar>
                    <AvatarFallback>
                      {room.other_user_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">{room.other_user_name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {room.last_message}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {activeRoomId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {filteredChatRooms
                    ?.find((room) => room.room_id === activeRoomId)
                    ?.other_user_name.charAt(0)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">
                  {
                    filteredChatRooms?.find(
                      (room) => room.room_id === activeRoomId
                    )?.other_user_name
                  }
                </h2>
                <p className="text-sm text-muted-foreground">Active now</p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mb-4" />
                  <p>No messages yet</p>
                  <p className="text-sm">Send a message to start the conversation</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => {
                    const showDateDivider =
                      index === 0 ||
                      !isSameDay(msg.createdat, messages[index - 1].createdat)

                    return (
                      <div key={index}>
                        {showDateDivider && <DateDivider date={msg.createdat} />}
                        <div
                          className={`flex ${
                            msg.sender_id === currentUser
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`px-4 py-2 rounded-lg max-w-[70%] ${
                              msg.sender_id === currentUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm break-words">{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.createdat).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button onClick={sendMessage}>Send</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-4" />
            <p>Select a conversation</p>
            <p className="text-sm">Choose a conversation from the sidebar to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}

