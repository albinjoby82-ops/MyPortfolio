import './CubiWorkflow.css';

const WORKFLOW = [
  {
    title: 'Choose a Cubi',
    body: 'The customer picks a Base, Board or Lite and the number of NFC tiles they need.',
    system: 'Product catalogue',
  },
  {
    title: 'Design it live',
    body: 'They choose the physical colours, add board text, assign tile links and watch the 3D model update.',
    system: 'React customiser',
  },
  {
    title: 'Prepare the logo',
    body: 'A screenshot or image becomes several clean SVG candidates. The customer chooses the version that still looks right.',
    system: 'Web Worker + WASM',
  },
  {
    title: 'Review the basket',
    body: 'The finished configuration, cleaned artwork and product choices travel together into the basket.',
    system: 'Design state',
  },
  {
    title: 'Pay securely',
    body: 'Cloudflare validates the order and Turnstile, reads server pricing, calculates shipping and creates an idempotent Stripe Checkout session.',
    system: 'Cloudflare + Stripe',
  },
  {
    title: 'Confirm the order',
    body: 'Stripe emails the receipt. Its signed webhook marks the Firestore order as paid, independently of the customer returning to the site.',
    system: 'Webhook + Firestore',
  },
  {
    title: 'Build the print file',
    body: 'The paid order appears in my private panel, where I reconstruct its preview and generate the coloured 3MF production file.',
    system: 'Admin production studio',
  },
  {
    title: 'Print and deliver',
    body: 'I open the file in Bambu Studio, print the separate colour and snap-fit pieces, assemble the NFC product and fulfil the order.',
    system: 'Bambu Studio',
  },
];

export default function CubiWorkflow() {
  return (
    <section className="cubiWorkflow gutter" aria-labelledby="cubi-workflow-title">
      <div className="cubiWorkflowHead">
        <span className="cubiPortfolioKicker">04 · Customer workflow</span>
        <h2 id="cubi-workflow-title">One order, from idea to finished Cubi.</h2>
        <p>
          The customer experiences one continuous flow. Underneath it, the
          browser, Cloudflare, Stripe, Firebase and my production tools each
          take responsibility for a different part of the order.
        </p>
      </div>

      <ol className="cubiWorkflowTimeline">
        {WORKFLOW.map((step, index) => (
          <li key={step.title}>
            <div className="cubiWorkflowNumber" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="cubiWorkflowCopy">
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <span>{step.system}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
