"use client";
import { FC, useState } from "react";
import Image from "next/image";
import { confirmPayment } from "../(dashboard)/actions/paymentActions";
import { useAppSelector } from "@/hooks/redux";
import type { RootState } from "@/store/store";

interface Course {
  id: number;
  acronym: string;
  name: string;
  price: number;
  image: string;
  description: string;
  features: string[];
}

export interface CartItem extends Course {
  quantity: number;
}

interface CartSidebarProps {
  cart: CartItem[];
  visible: boolean;
  onClose: () => void;
  removeFromCart: (id: number) => void;
}

const CartSidebar: FC<CartSidebarProps> = ({ cart, visible, onClose, removeFromCart }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => setModalOpen(true);
  const { user } = useAppSelector((state: RootState) => state.auth);

  const handleConfirmPayment = async () => {
    if (!user) {
      alert("Please sign in to complete your purchase.");
      return;
    }

    try {
      setIsProcessing(true);
      const cartItems = cart.map(item => ({
        name: item.name,
        price: item.price * item.quantity
      }));

      await confirmPayment(user.name, user.email, getTotalPrice(), cartItems);
      
      alert("Payment submitted! Please check your email for confirmation.");
      setModalOpen(false);
      onClose(); // Close the cart sidebar
      removeFromCart(-1); // Clear the cart
    } catch (error) {
      console.error('Payment confirmation error:', error);
      alert("There was an error processing your payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 shadow-xl z-50 transform transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-l-2xl shadow-lg">
          <div className="p-4 border-b border-blue-100 dark:border-blue-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
           Courses Cart ({getTotalItems()})
            </h2>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-gray-800 font-bold">X</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-10">Your cart is empty</p>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl shadow-md bg-white dark:bg-gray-700"
                >
                  <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-xl object-cover"/>
                  <div className="flex-1 ml-3">
                    <h3 className="font-medium text-blue-700 dark:text-blue-300">{item.acronym}</h3>
                    <p className="text-sm text-blue-500 dark:text-blue-200">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 dark:text-red-400 text-sm">
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t border-blue-100 dark:border-blue-700">
              <div className="flex justify-between font-semibold text-lg text-blue-700 dark:text-blue-400 mb-3">
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-11/12 max-w-md shadow-lg">
            <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4">Confirm Your Purchase</h3>
            
            {/* Course Summary */}
            <div className="mb-6">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Order Summary</h4>
              <div className="space-y-2 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{item.name} (x{item.quantity})</span>
                    <span className="font-medium text-blue-700 dark:text-blue-300">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-800 dark:text-gray-200">Total Amount</span>
                    <span className="text-blue-700 dark:text-blue-300">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Payment Instructions</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                Please transfer the total amount to:
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-sm">
                <p className="mb-1"><span className="font-medium">Bank:</span> ABC Bank</p>
                <p className="mb-1"><span className="font-medium">Account Number:</span> 1234-5678-9012</p>
                <p><span className="font-medium">Account Name:</span> MANSOL LMS</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className={`px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold transition flex items-center justify-center min-w-[120px] ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Confirm Purchase'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartSidebar;
