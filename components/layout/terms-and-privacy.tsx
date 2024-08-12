export function TermsAndPrivacy() {
  return (
    <div className="w-full py-5 text-center">
      <p className="text-gray-500">
        <a
          className="font-semibold text-gray-600 underline-offset-4 transition-colors hover:underline"
          href="/extrapolate-terms-of-service.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms of Service
        </a> and{" "}
        <a
          className="font-semibold text-gray-600 underline-offset-4 transition-colors hover:underline"
          href="/extrapolate-privacy-policy.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
      </p>
    </div>
  )
}