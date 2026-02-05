import Link from "next/link";

export default function SuccessPage() {
    return (
        <div className="page-container">
            <h2 className="text-large">Demo complete (no purchase was made)</h2>
            <p className="demo-note">This is a portfolio demo. Checkout uses <strong>Stripe test mode (sandbox)</strong> and no real charges are made.</p>
            <Link href={'/'}>
                <button>Continue &rarr;</button>
            </Link>
        </div>
    )
}