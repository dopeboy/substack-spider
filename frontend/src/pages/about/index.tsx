const About = () => {
    return (
        <>

            <h2 className="mb-2 text-3xl font-semibold text-gray-900">About</h2>
            <ul className="space-y-1 list-disc list-inside">
                <li>
                    Created by <a className="font-medium text-blue-600 hover:underline" href="https://twitter.com/manishsinhaha" target="_blank">@manishsinhaha</a>, who&apos;s exploring the healthcare industry and needed a tool to accelerate his research.
                </li>
                <li>
                    Inspired by <a className="font-medium text-blue-600 hover:underline" href="https://www.linkedin.com/in/david-chen-71722b7/" target="_blank">David Chen</a>, who built the <a target="_blank" className="font-medium text-blue-600 hover:underline" href="https://i.imgur.com/qTsrT4J.png">original</a> more than two years ago.
                </li>
                <li>
                    Comments/feedback? Would love to hear <a className="font-medium text-blue-600 hover:underline" href="mailto: arithmetic@gmail.com">them.</a>
                </li>
            </ul>
            <br/>
            <h2 className="mb-2 text-3xl font-semibold text-gray-900">Misc</h2>
            <ul className="space-y-1 list-disc list-inside">
                <li>
                    19963 articles indexed across tech, business, and crypto
                </li>
                <li>
                    Summaries are done via GPT-3.5 Turbo
                </li>
                <li>
                    Built using django + react + typesense. Hosted on Vercel
                </li>
            </ul>
        </>
    )
}

export default About