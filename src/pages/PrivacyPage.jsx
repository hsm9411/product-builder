import React from 'react';
import { NavLink } from 'react-router-dom';

const PrivacyPage = () => {
    return (
        <div className="content-section">
            <h1>개인정보처리방침 (Privacy Policy)</h1>
            <p><strong>최종 수정일: 2024년 1월 10일</strong></p>

            <h2>1. 수집하는 개인정보</h2>
            <p>본 사이트('Product Builder')는 사용자가 연락처 양식(Contact Form)을 통해 이름과 이메일 주소를 자발적으로 제공하는 경우에만 개인정보를 수집합니다.</p>

            <h2>2. 정보의 사용</h2>
            <p>수집된 이름과 이메일 주소는 오직 사용자 문의에 응답하기 위한 목적으로만 사용됩니다.</p>

            <h2>3. 제3자 서비스</h2>
            <p>본 사이트는 다음과 같은 제3자 서비스를 사용하고 있으며, 각 서비스의 개인정보 정책은 해당 서비스의 정책을 따릅니다.</p>
            <ul>
                <li><strong>Google AdSense:</strong> 광고 게재를 위해 사용되며, 사용자의 관심사에 맞는 광고를 제공하기 위해 쿠키를 사용할 수 있습니다. Google의 광고 정책에 대한 자세한 내용은 <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">여기</a>에서 확인하실 수 있습니다.</li>
                <li><strong>Disqus:</strong> 댓글 기능을 제공하며, Disqus 계정 정보를 통해 사용자를 식별합니다.</li>
                <li><strong>EmailJS:</strong> 연락처 양식을 통한 이메일 전송 기능을 제공합니다.</li>
            </ul>

            <h2>4. 데이터 보안</h2>
            <p>
                '얼굴상 분석기' 기능의 경우, 사용자가 업로드한 이미지는 서버에 저장되거나 전송되지 않습니다. 모든 분석 과정은 사용자의 브라우저 내에서 로컬로 처리되며, 페이지를 벗어나는 즉시 데이터는 소멸됩니다.
            </p>

            <h2>5. 정책 변경</h2>
            <p>본 개인정보처리방침은 법률이나 서비스의 변경 사항에 따라 수정될 수 있으며, 변경 시에는 본 페이지를 통해 고지합니다.</p>

            <h2>6. 문의</h2>
            <p>개인정보 관련 문의는 <NavLink to="/contact">연락처 페이지</NavLink>를 통해 문의해주시기 바랍니다.</p>
        </div>
    );
};

export default PrivacyPage;
