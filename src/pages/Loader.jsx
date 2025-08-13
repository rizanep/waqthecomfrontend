
import { Spinner } from "react-bootstrap";
import "./loader.css"; // optional for custom styling

export default function Loader() {
  return (
    <div className="loader-container">
      <Spinner animation="border" variant="primary" />
    </div>
  );
}
