'use server';

import { sendEmail } from '@/lib/email';

interface InquiryEmailData {
  name: string;
  email: string;
  phone: string;
  message: string;
  courseTitle: string;
  courseFee: string;
  courseDuration: string;
  courseRequirements: string;
  courseAwardingBody: string;
}

export async function sendInquiryEmail(data: InquiryEmailData) {
  try {
    // Send confirmation email to the student
    await sendEmail(
      data.email,
      `Your Inquiry for ${data.courseTitle} - MANSOL HAB School of Skills`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #3b82f6; margin-bottom: 10px;">Thank You for Your Interest!</h1>
            <p style="font-size: 16px; color: #4b5563;">We've received your inquiry about our course.</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; font-size: 18px; margin-top: 0;">Course Details</h2>
            <p><strong>Course:</strong> ${data.courseTitle}</p>
            <p><strong>Duration:</strong> ${data.courseDuration}</p>
            <p><strong>Fee:</strong> ${data.courseFee}</p>
            <p><strong>Requirements:</strong> ${data.courseRequirements}</p>
            <p><strong>Awarding Body:</strong> ${data.courseAwardingBody}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h2 style="color: #1f2937; font-size: 18px;">Next Steps</h2>
            <ol style="color: #4b5563; padding-left: 20px;">
              <li>Our admissions team will contact you within 24 hours at ${data.phone}.</li>
              <li>You'll receive detailed registration instructions and payment options.</li>
              <li>Once registered, you'll get your unique Learner ID and login credentials.</li>
            </ol>
          </div>
          
          <div style="background-color: #eff6ff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #1e40af; font-size: 18px; margin-top: 0;">Your Inquiry Details</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #6b7280; font-size: 14px;">If you have any questions, please contact us at <a href="mailto:info@mansolhab.edu" style="color: #3b82f6;">info@mansolhab.edu</a> or call us at +92-XXX-XXXXXXX.</p>
            <p style="color: #6b7280; font-size: 14px;">&copy; ${new Date().getFullYear()} MANSOL HAB School of Skills Development. All rights reserved.</p>
          </div>
        </div>
      `
    );

    // Send notification to admin
    await sendEmail(
      process.env.ADMIN_EMAIL || 'admin@mansolhab.edu',
      `New Course Inquiry: ${data.courseTitle}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #3b82f6; margin-bottom: 20px;">New Course Inquiry</h1>
          
          <div style="margin-bottom: 20px;">
            <h2 style="color: #1f2937; font-size: 18px;">Student Information</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; font-size: 18px; margin-top: 0;">Course Details</h2>
            <p><strong>Course:</strong> ${data.courseTitle}</p>
            <p><strong>Duration:</strong> ${data.courseDuration}</p>
            <p><strong>Fee:</strong> ${data.courseFee}</p>
          </div>
          
          <div style="margin-top: 30px;">
            <p style="color: #4b5563;">Please follow up with this student within 24 hours.</p>
          </div>
        </div>
      `
    );

    return { success: true };
  } catch (error) {
    console.error('Error sending inquiry email:', error);
    throw new Error('Failed to send inquiry email');
  }
}