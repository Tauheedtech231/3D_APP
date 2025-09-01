"use server";

import { sendEmail } from "@/lib/email";

export async function confirmPayment(studentName: string, studentEmail: string, total: number, cart: { name: string; price: number }[]) {
  const coursesList = cart.map(item => `<li>${item.name} - $${item.price.toFixed(2)}</li>`).join('');

  // 1. Email to student
  await sendEmail(
    studentEmail,
    "Course Purchase Confirmation - MANSOL LMS",
    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af;">Thank you for your purchase!</h2>
      <p>Dear ${studentName},</p>
      <p>We have received your payment request for the following course(s):</p>
      <ul style="list-style-type: none; padding-left: 0;">
        ${coursesList}
      </ul>
      <p><strong>Total Amount: $${total.toFixed(2)}</strong></p>
      <p>Your order is currently pending admin verification. Once verified, you will receive access to your course(s).</p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>MANSOL LMS Team</p>
    </div>`
  );

  // 2. Email to admin
  await sendEmail(
    'mansol.largify@gmail.com',
    "New Course Purchase - MANSOL LMS",
    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af;">New Course Purchase</h2>
      <p><strong>Student Details:</strong></p>
      <ul style="list-style-type: none; padding-left: 0;">
        <li>Name: ${studentName}</li>
        <li>Email: ${studentEmail}</li>
      </ul>
      <p><strong>Purchased Courses:</strong></p>
      <ul style="list-style-type: none; padding-left: 0;">
        ${coursesList}
      </ul>
      <p><strong>Total Amount: $${total.toFixed(2)}</strong></p>
      <p>Please verify this payment and grant course access to the student.</p>
    </div>`
  );

  return { success: true };
}
