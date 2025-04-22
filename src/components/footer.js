import React , { useState } from 'react';

const Footer = () => {
    return (
      <footer className="custom-footer bg-dark py-0 position-relative">
        <div className="container pt-1">
          <div className="row text-center text-sm-start align-items-center py-2">
            <div className="col-sm-6">
              <div>
                <p className="copy-rights mb-0">
                  © {new Date().getFullYear()} Job Foundation
                </p>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="text-sm-end mt-3 mt-sm-0">
                <ul className="list-inline mb-0 footer-list gap-4 fs-13">
                  <li className="list-inline-item">
                    <a href="/pages-privacy-policy">Privacy Policy</a>
                  </li>
                  <li className="list-inline-item">
                    <a href="/pages-term-conditions">Terms & Conditions</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  export default Footer