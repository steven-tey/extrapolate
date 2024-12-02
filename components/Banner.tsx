export function Banner() {
  return (
    <div
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ease-in-out`}
    >
      <div className="flex w-full items-center justify-center gap-x-6 bg-red-500 px-6 py-3 sm:px-3.5">
        <div className="flex items-center text-sm font-medium leading-6 text-white">
          <p>🎉 Black Friday & Cyber Monday: Get 50% OFF with code BFCM2024! 🛍️</p>
        </div>
      </div>
    </div>
  )
}