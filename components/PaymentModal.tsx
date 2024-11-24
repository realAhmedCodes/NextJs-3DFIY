import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'

interface PaymentModalProps {
  model: any
  userId: string
  authToken: string
  onClose: () => void
  onSuccess: () => void
}

export default function PaymentModal({ model, userId, authToken, onClose, onSuccess }: PaymentModalProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-confirmation`,
      },
    })

    if (stripeError) {
      setPaymentError(stripeError.message || 'An unexpected error occurred.')
      setIsProcessing(false)
    } else {
      // Payment succeeded
      onSuccess()
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">{model.model_name}</h3>
              <p className="text-sm text-gray-500">Price: ${model.price}</p>
            </div>
            <PaymentElement />
            {paymentError && (
              <Alert variant="destructive">{paymentError}</Alert>
            )}
            <Button type="submit" disabled={isProcessing || !stripe || !elements} className="w-full">
              {isProcessing ? 'Processing...' : `Pay $${model.price}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

