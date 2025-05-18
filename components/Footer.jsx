import {
 
  Container,
  Row,
  Col,
  
} from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
export default 
function Footer() {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <Container>
        <Row>
        
          <Col xs={12} md={4} className=" mb-4 mb-md-0">
            <h5 className="fw-bold">WAQTH Store Directories</h5>
            <div className="d-flex flex-column">
              <div className="d-flex flex-column mt-1">
                
                <a href="#" className="text-light small text-decoration-none">
                  WAQTH Usman Road
                </a>
                <a href="#" className="text-light small text-decoration-none">
                  WAQTH Adyar
                </a>
                <a href="#" className="text-light small text-decoration-none">
                  WAQTH Express Avenue Mall
                </a>
                <a href="#" className="text-light small text-decoration-none">
                  WAQTH Rado Express Avenue
                </a>
                <a href="#" className="text-light small text-decoration-none">
                  WAQTH Seiko - Express Avenue Mall
                </a>
                <a href="#" className="text-light small text-decoration-none">
                  WAQTH Phoenix MarketCity Mall
                </a>
                <a href="#" className="text-light small text-decoration-none">
                  WAQTH Seiko Phoenix MarketCity Mall
                </a>
                <a href="#" className="text-light small text-decoration-none">
                  WAQTH VR Chennai Mall
                </a>
                <a href="#" className="text-light small text-decoration-none">
                  WAQTH Tissot VR Chennai Mall
                </a>
                <a href="#" className="text-light small text-decoration-none">
                  WAQTH Rado VR Chennai Mall
                </a>
                <a href="#" className="text-light small text-decoration-none">
                  WAQTH Longines VR Chennai Mall
                </a>
                
                
              </div>
            </div>
          </Col>

          
          <Col xs={12} md={3} className="mb-4 mb-md-0">
            <h5 className="fw-bold">Contact Us</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-light small text-decoration-none">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="text-light small text-decoration-none">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-light small text-decoration-none">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-light small text-decoration-none">
                  Terms & Condition
                </a>
              </li>
              <li>
                <a href="#" className="text-light small text-decoration-none">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-light small text-decoration-none">
                  Cancellation and Refund
                </a>
              </li>
              <li>
                <a href="#" className="text-light small text-decoration-none">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-light small text-decoration-none">
                  About
                </a>
              </li>
            </ul>
          </Col>

      
          <Col xs={12} md={3} className="mb-4 mb-md-0">
            <h5 className="fw-bold">Brands</h5>
            <div className="d-flex flex-column">
              <a href="#" className="text-light small text-decoration-none">
                Fossil
              </a>
              <a href="#" className="text-light small text-decoration-none">
                Giordano
              </a>
              <a href="#" className="text-light small text-decoration-none">
                Gucci
              </a>
              <a href="#" className="text-light small text-decoration-none">
                Guess
              </a>
              <a href="#" className="text-light small text-decoration-none">
                Helix
              </a>
              <a href="#" className="text-light small text-decoration-none">
                Hublot
              </a>
              <a href="#" className="text-light small text-decoration-none">
                Hugo Boss
              </a>
              <a href="#" className="text-light small text-decoration-none">
                Kenneth Cole
              </a>
              <a href="#" className="text-light small text-decoration-none">
                Longines
              </a>
              <a href="#" className="text-light small text-decoration-none">
                Michael Kors
              </a>
              <a href="#" className="text-light small text-decoration-none">
                Mont Blanc
              </a>
              <a href="#" className="text-light small text-decoration-none">
                Movado
              </a>
            </div>
          </Col>

          
          <Col xs={12} md={2} className="text-center text-md-end">
            <div className="d-flex flex-column align-items-center align-items-md-end">
              <h5 className="fw-bold mb-3">Follow us</h5>
              <div className="d-flex justify-content-center justify-content-md-end">
                <a href="#" className="text-light me-3">
                  <FaFacebook className="fs-4" />
                </a>
                <a href="#" className="text-light me-3">
                  <FaTwitter className="fs-4" />
                </a>
                <a href="#" className="text-light me-3">
                  <FaInstagram className="fs-4" />
                </a>
                <a href="#" className="text-light">
                  <FaYoutube className="fs-4" />
                </a>
              </div>
            </div>
          </Col>
        </Row>

        <hr className="border-secondary my-4" />

        <p className="text-center mb-0">
          &copy; {new Date().getFullYear()} WAQTH Store. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}