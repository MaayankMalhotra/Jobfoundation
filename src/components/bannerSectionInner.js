
import React  from 'react';
import { Link } from 'react-router-dom';
const BannerSectionInnr = ({ htmlContent = '', data = {}, classAdd= '', noWrapperClass=false })=> {
  const renderHTML = () => {
    let rendered = htmlContent;
    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      rendered = rendered.replace(regex, data[key]);
    });
    return rendered;
  };
    return (
      <section className={`section gardientbgColor ${classAdd}`} style={{backgroundColor: '#f4f7fc'}}>
        <div className={noWrapperClass ? '' : 'custom-container'}>
          <div className=''
            dangerouslySetInnerHTML={{ __html: renderHTML() }} >
          </div>
        </div>
      </section>
    );
  };

  export default BannerSectionInnr;