import React from 'react';
import Draggable from 'react-draggable';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import SecurityBanner from '../components/SecurityBanner';

function AboutUs() {
  const teamMembers = [
    {
      name: 'Lee ZhiCheng',
      role: 'Dog Facts API, News API',
      description: 'I am a student from INTI Penang taking a course of degree in Computing. ',
      image: 'https://previews.123rf.com/images/mdranahamid/mdranahamid2002/mdranahamid200201594/140899818-initial-zc-logo-design-vector-template-creative-letter-zc-business-logo-vector-illustration.jpg' // Replace with the URL of the network image for the respective team member
    },
    {
      name: 'Chan Tai Teng',
      role: 'Cat API, Authentication',
      description: 'Degree in Computing. Smart and Handsome. Not Single.',
      image: 'https://www.shutterstock.com/image-vector/logo-design-letter-tt-brand-260nw-1729855027.jpg' // Replace with the URL of the network image for the respective team member
    },
    {
      name: 'David Ong Lip Wei',
      role: 'Cat Facts API',
      description: 'A computing people person from BCTCU who enjoys with other people like hanging out together.',
      image: 'https://images-platform.99static.com/OPe-spXyTTddx9iUdz1mNdNtG-M=/500x500/top/smart/99designs-contests-attachments/17/17667/attachment_17667611' // Replace with the URL of the network image for the respective team member
    },
    {
      name: 'Ng E Soon',
      role: 'Dog API',
      description: 'I am a computing student currently studying at INTI College Penang.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_NQN07ZmyThPSrW16y0vW2HZ96FhDU9h8dg&usqp=CAU' // Replace with the URL of the network image for the respective team member
    }
  ];

  return (
    <div style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
      <Header />
      <SecurityBanner/>
      <BackToTop />

      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <br />
          <h1 style={{ fontWeight: 'bold', fontSize: 40, textAlign: 'center' }}>Our Team</h1>
          <br />
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {teamMembers.map((member, index) => (
              <Draggable key={index}>
                <div
                  style={{
                    background: 'linear-gradient(to bottom right, #FBE8E8, #FCC2C2)',
                    padding: '20px',
                    margin: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '10px',
                    cursor: 'move',
                    width: '400px', // Adjust the desired width
                    height: '200px', // Adjust the desired height
                  }}
                >
                  {/* Team member content */}
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: '20px'
                    }}
                  />
                  <div>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '10px' }}>{member.name}</h4>
                    <p>{member.role}</p>
                    <p style={{ color: 'grey' }}>{member.description}</p>
                  </div>
                </div>
              </Draggable>
            ))}
          </div>
        </div>
      </section>
      <br />
      <br />
      <Footer />
    </div>
  );
}

export default AboutUs;
