#  💻한성대학교 내 물품 쉐어링(대여 및 관리) 웹서비스 Ah!Chacha

- 배포 URL : 
- ID: 한성대학교 종합정보시스템 학번
- Password: 한성대학교 종합정보시스템 비밀번호

<br>

## 프로젝트 소개

- Ah!Chacha는 한성대학교 내 물품 쉐어링(대여 및 관리) 웹서비스 플랫폼입니다.
- 
- 
- 

<br>

## 팀원 구성

<div align="center">
    <img width="586" alt="스크린샷 2024-05-14 오후 11 11 31" src="https://github.com/Ahchacha-CapstoneDesign/Web/assets/122718910/530fccf4-a32a-4f19-8dc8-7209fe3c2a29">
</div>

<br>

## 1. 개발 언어
- JAVA : Java는 그 자체로 플랫폼으로 사용할 수 있는 다중 플랫폼, 객체 지향 및 네트워크 중심 언어로서 프로젝트 내 백엔드 파트에서 사용
- JavaScript: JavaScript는 '웹페이지에 생동감을 불어넣기 위해' 만들어진 프로그래밍
언어로서 프로젝트 내 프론트엔드 파트에서 사용

## 2. 개발 도구
**Backend**
- IntelliJ IDEA
    - IntelliJ IDEA는 JetBrains이 개발한 자바를 포함한 다양한 프로그래밍 언어를 위한 통합 개발 환경(IDE)으로 프로그래머의 생산성을 향상시키기 위해 설계
    - 코드 작성, 디버깅, 리팩토링, 테스트, 버전 관리 등의 개발 작업에 필요한 다양한 기능을 제공
- IntelliJ DataGrip
    - 외부 접속을 하기 위해서 DB 개발과 관리를 용이하게 해주는 GUI 개발 툴이며 프로젝트 내 AWS RDS와 MySQL과 연동하여 사용
- Swagger
    - 개발한 Rest API를 편리하게 문서화, 이를 통해 관리 및 제 3의 사용자가 편리하게 API호출 및 테스트를 할 수 있는 프로젝트
- AWS
    - 전 세계적으로 분포한 데이터 센터에서 200개가 넘는 완벽한 기능의 서비스를 제공하는, 세계적으로 가장 포괄적이며, 널리 채택되고 있는 클라우드
- Hibernate
    - Java 환경을 위한 객체 관계형 매핑 솔루션
    - Hibernate는 애플리케이션 도메인 개체를 관계형 데이터베이스 테이블에 매핑하거나 그 반대로 매핑하기 위한 프레임 워크를 제공하는 Java 기반 ORM 도구

**Frontend**
- Visual Studio Code
    - Visual Studio Code는 마이크로소프트에서 오픈소스로 개발하고 있는 소스 코드 에디터
    - 웹 기반으로 기술들로 데스크톱 애플리케이션을 만들 수 있는 GitHub의 일렉트론을 기반으로 만들어져 맥OS, 리눅스, 윈도우 등 메이저 운영체제를 모두 지원
- React
    - React는 사용자 인터페이스를 구축하기 위한 선언적이고 효율적이며 유연한 JavaScript 라이브러리
- Axios
    - Npm을 이용하여 다운로드 가능한 HTTP request 모듈이는 ES6 Promise API를 지원하며 브라우저의 HTTP request에 사용
- Netlify
    - GitHub, GitLab 등과 계정 연동 및 쉬운 호스팅을 제공
    - CDN, Continuous Deployment(지속적 배포), One-lick HTTPS 제공 등 고성능 사이트 / 웹 응용 프로그램을 제작하는데 필요한 쉽고 빠른 다양한 서비스들을 제공
 
**Design**
- Figma
    - Figma는 온라인에서 사용할 수 있는 디자인 툴로, UX/UI 디자인 및 프로토타입 제작을 위한 기능들을 제공
    - 웹・앱・인터페이스 디자인 등 다양한 분야에서 사용되며, 디자인과 개발 과정에서 필요한 여러 협업 기능을 지원

협업 툴 : Discord, Notion, Github

## 3. 프레임워크
- Java Spring Boot
    - Spring Boot는 Java 백엔드 개발을 위한 강력하고 편리한 프레임워크로,개발자가 빠르고 쉽게 애플리케이션을 개발할 수 있는 도구
    - Spring 프레임워크를 기반으로 하여, 복잡한 설정 없이도 독립적인, 생산 수준의 애플리케이션을 쉽게 만들 수 있도록 설계된 도구


<br>

## 4. 브랜치 전략

### Front-end

- Git-flow 전략을 기반으로 main, develop 브랜치와 개인별 보조 브랜치를 운용했습니다.
- main, develop, 개인별 브랜치로 나누어 개발을 하였습니다.
    - **main** 브랜치는 배포 단계에서만 사용하는 브랜치입니다.
    - **develop** 브랜치는 개발 단계에서 git-flow의 master 역할을 하는 브랜치입니다.

### Back-end

- Git-flow 전략을 기반으로 main, feature/기능 브랜치 생성 시 develop 브랜치에서 운용했습니다.
- main, develop브랜치로 나누어 개발을 하였습니다.
    - **main** 브랜치는 배포 단계에서만 사용하는 브랜치입니다.
    - **develop** 브랜치는 개발 단계에서 git-flow의 master 역할을 하는 브랜치입니다.

### Pull Request 규칙
    1. Commit, Push
    2. **pr** 생성
        **→ develop 브랜치로! main 브랜치(x)**
        제목: type 내용 (ex. [FEAT] 회원가입 기능 구현)
        내용: 어떤 기능 (어떤 코드 추가, 어떤 오류 수정) 작업했는지 내용 작성하기 (ex. 이메일 중복 확인 코드 추가, 닉네임 중복 확인 코드 추가 등)
    3. Merge
    <div align="center">
        <img width="580" alt="스크린샷 2024-05-14 오후 11 17 10" src="https://github.com/Ahchacha-CapstoneDesign/Web/assets/122718910/fcf37c20-aa06-4325-8e94-3e45104430db">
    </div>
<br>

## 4. 역할 분담

### 조성빈(팀장)

- **Frontend**
    - 페이지 : 홈, 검색, 게시글 작성, 게시글 수정, 게시글 상세, 채팅방
    - 공통 컴포넌트 : 게시글 템플릿, 버튼
- **Design**
    - 유저 검색, 게시글 등록 및 수정, 게시글 상세 확인, 댓글 등록, 팔로워 게시글 불러오기, 좋아요 기능

<br>
    
### 👻김민제

- **UI**
    - 페이지 : 프로필 설정, 프로필 수정, 팔로잉&팔로워 리스트, 상품 등록, 상품 수정, 채팅 목록, 404 페이지
    - 공통 컴포넌트 : 탭메뉴, InputBox, Alert 모달, 댓글
- **기능**
    - 프로필 설정 및 수정 페이지 유저 아이디 유효성 및 중복 검사, 상품 등록 및 수정

<br>

### 😎양희지

- **UI**
    - 페이지 : splash 페이지, sns 로그인 페이지, 로그인, 회원가입
    - 공통 컴포넌트 : 상품 카드, 사용자 배너
- **기능**
    - splash 페이지, sns로그인 페이지, 로그인 유효성 및 중복 검사, 회원가입 유효성 및 중복 검사, 이메일 검증, 프로필 설정, 접근제한 설정

<br>

### 🐬지창언

- **UI**
    - 페이지 : 사용자 프로필 페이지
    - 공통 컴포넌트 : 탑배너, 하단 모달창
- **기능**
    - 팔로우 & 언팔로우, 로그아웃, 하단 모달창, 댓글 삭제, 게시글 삭제, 상품 삭제, 사용자 게시글 앨범형 이미지, 탑 배너 뒤로가기 버튼, Alert 모달
    
<br>

## 5. 개발 기간 및 작업 관리

### 개발 기간

- 전체 개발 기간 : 2022-12-09 ~ 2022-12-31
- UI 구현 : 2022-12-09 ~ 2022-12-16
- 기능 구현 : 2022-12-17 ~ 2022-12-31

<br>

## 10. 프로젝트 후기

### 🍊 고지연

깃헙을 통한 협업에 익숙해지는 것, 서로 감정 상하지 않고 무사히 마무리하는 것이 1차적인 목표였어서 항상 이 부분을 명심하면서 작업했습니다.
각자 페이지를 작업하고 합치는 과정에서 마주친 버그들이 몇 있었는데, 시간에 쫓기느라 해결하기에 급급해서 제대로 트러블슈팅 과정을 기록하지 못한 게 살짝 아쉬운 부분으로 남습니다. 그래도 2022년 한 해 동안 가장 치열하게 살았던 한 달인 것 같습니다. 조원들 모두에게 고생했다고 전하고 싶습니다🧡

<br>

### 👻 김민제

여러모로 많은 것들을 배울 수 있었던 한 달이었습니다. 혼자서는 할 수 없었던 일이라는 것을 너무 잘 알기에 팀원들에게 정말 감사하다는 말 전하고 싶습니다. 개인적으로 아쉬웠던 부분은 기한 내에 기능을 구현하는 데에만 집중하면서 트러블 슈팅이나 새로 배웠던 것들을 체계적으로 기록하지 못했다는 점입니다. 이렇게 느낀 바가 있으니 이후의 제가 잘 정리하면서 개발할 거라 믿습니다… 하하 다들 수고하셨습니다!!!!

<br>

### 😎 양희지

팀 프로젝트 시작에 앞서 초기 설정을 진행하며 체계적인 설계의 중요성을 느꼈습니다. 앞으로는 점점 더 체계적이고 효율적으로 프로젝트를 진행할 수 있도록 발전하고 싶습니다.
정규 수업 직후에 프로젝트를 진행하면서 배운 내용을 직접 구현하는 과정이 어색했지만 어떤 부분이 부족한지 알 수 있는 기회였습니다. 스스로 최대한 노력해보고 팀원들과 함께 해결해 나가면서 협업의 장점을 체감할 수 있었습니다. 하지만 빠르게 작업을 진행하면서 팀원들과 함께 해결한 이슈가 어떤 이슈이며 어떻게 해결했는지에 대해 자세히 작성하지 못한 것이 아쉽습니다.
’멋쟁이 사자처럼’이라는 같은 목표를 가진 집단에서 프로젝트에 함께할 수 있는 소중한 경험이었습니다. 함께 고생한 조원들 모두 고생하셨습니다! 앞으로도 화이팅해서 함께 목표를 이뤄가고 싶습니다.

<br>

### 🐬 지창언

컨벤션을 정하는 것부터 Readme 파일 작성까지 전 과정을 진행하려니 처음 생각보다 많은 에너지를 썼어요. 좋은 의미로 많이 썼다기보다, 제 능력을 십분 발휘하지 못해서 아쉬움이 남는 쪽입니다. 개발한다고 개발만 해서는 안 된다는 것을 몸소 느껴보는 기간이었던 것 같습니다. 이번 기회로 프로젝트를 진행하면서, 제가 잘하는 점과 부족한 점을 확실하게 알고 가는 건 정말 좋습니다. 기술적인 부분에 있어서는 리액트의 컴포넌트화가 주는 장점을 알았습니다. 조금 느린 개발이 되었을지라도 코드 가독성 부분에 있어서 좋았고, 오류가 발생해도 전체가 아닌 오류가 난 컴포넌트와 근접한 컴포넌트만 살펴보면 수정할 수 있는 부분이 너무 편했습니다. 모두 고생 참 많으셨고 리팩토링을 통해 더 나은 프로젝트 완성까지 화이팅입니다.
