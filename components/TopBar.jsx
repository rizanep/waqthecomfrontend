import {
 
  Container,
  Row,
  Col,
  
} from "react-bootstrap";

export default  function TopBar() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-light py-2 border-bottom text-muted">
      <Container>
        <Row className="align-items-center ">
          <Col md={4} className=" text-center text-lg-start ">
            <small>{today}</small>
          </Col>
          <Col md={4} className="text-center">
            <small>Calicut | Delhi | Mumbai</small>
          </Col>
          <Col md={4} className="text-center text-lg-end">
            <small>+91 87250 28882 | +91 87250 28887 | +91 87250 28835</small>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
