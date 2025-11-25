import React from "react";

export default function VerificationMessage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c1524] text-white px-4">
      <div className="w-full max-w-2xl bg-gradient-to-br from-[#152235] to-[#1a2e42] rounded-2xl p-8 shadow-2xl border border-green-500/30">
        {/* Header with Icon */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-400 mb-3">
            Submissions Complete!
          </h1>
          <p className="text-lg text-gray-300">You've successfully completed all 7 days</p>
        </div>

        {/* Main Message */}
        <div className="bg-[#0d1829]/50 rounded-xl p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">We are verifying your daily post submissions</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Thank you for completing all 7 days of post submissions! Our team is now reviewing your contributions to ensure they meet our quality standards.
          </p>
          <p className="text-gray-300 leading-relaxed">
            After verification, we will contact you with further details and next steps.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/30 mb-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zM8 7a1 1 0 000 2h6a1 1 0 000-2H8zm0 4a1 1 0 000 2h6a1 1 0 000-2H8z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-300 mb-1">Check Your Emails</h3>
              <p className="text-blue-200 text-sm">
                Please keep checking your email inbox and spam folder for updates from our team.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-white">Submissions Received</p>
              <p className="text-gray-400 text-sm">All 7 days completed successfully</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="font-semibold text-white">Under Verification</p>
              <p className="text-gray-400 text-sm">Our team is reviewing your posts</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <p className="text-xs text-gray-400">3</p>
            </div>
            <div>
              <p className="font-semibold text-white">Contact You</p>
              <p className="text-gray-400 text-sm">We'll reach out with next steps via email</p>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            If you have any questions, please check your email for contact information or reach out to our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
