import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import PaymentModal from "@/app/componets/modelPurchase/PaymentModal";
import Reviews from "@/app/componets/Reviews/Reviews";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import LoginModal from "../app/componets/LoginModal";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
// Initialize Stripe
const stripePromiseClient = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
);

export default function ModelActions({
  userId,
  modelUserId,
  desginerId,
  model,
  modelId,
  hasPurchased,
  onBuy,
  onDownload,
  isCurrentUserSeller,
  onUpdateModel,
  onDeleteModel,
  authToken,
  handlePurchaseSuccess,
}) {
const {  sellerType, sellerId } = useSelector(
  (state: any) => state.user
);
 const router = useRouter()
   const handleUpdateModel = () => {
     router.push(`/pages/updateModel/${modelId}`);
   };
console.log(modelUserId ,userId)
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Pricing</h2>
          {model.is_free && (
            <Badge className="text-md py-0 font-medium mt-2">Free</Badge>
          )}{" "}
          {model.type != "scraped" && (
            <p className="text-2xl font-bold text-gray-800">${model.price}</p>
          )}
        </div>
        <div className="self-end">
          {model.is_free || hasPurchased ? (
            <Button onClick={onDownload}>
              {model.type == "scraped" ? "View Source" : "Download"}
            </Button>
          ) : userId ? (
            <>
              <Drawer>
                <DrawerTrigger>
                  {sellerId !== desginerId && (
                    <Button onClick={onBuy}>Buy Now</Button>
                  )}
                </DrawerTrigger>
                <DrawerContent>
                  <Elements stripe={stripePromiseClient}>
                    <PaymentModal
                      model={model}
                      userId={userId}
                      authToken={authToken}
                      onSuccess={handlePurchaseSuccess}
                    />
                  </Elements>
                </DrawerContent>
              </Drawer>
            </>
          ) : (
            <>
              <Dialog>
                <DialogTrigger>
                  <Button>Buy Now</Button>
                </DialogTrigger>
                <DialogContent className="p-0">
                  <LoginModal />
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
      {userId === modelUserId && (
        <div className="flex space-x-4 mt-4">
          <Button
            variant="outline"
            onClick={handleUpdateModel}
            className="flex items-center"
          >
            <Edit className="w-5 h-5 mr-2" />
            Update Model
          </Button>
          <Button
            variant="destructive"
            onClick={onDeleteModel}
            className="flex items-center"
          >
            <Trash className="w-5 h-5 mr-2" />
            Delete Model
          </Button>
        </div>
      )}
    </Card>
  );
}
