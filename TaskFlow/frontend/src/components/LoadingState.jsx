export default function LoadingState({ text = "Loading..." }) {
  return <div className="state-box"><span className="spinner" />{text}</div>;
}
