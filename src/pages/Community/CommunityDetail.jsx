    import React, { useState, useEffect, useRef } from 'react';
    import styled from 'styled-components';
    import { useParams } from 'react-router-dom';
    import { useNavigate } from 'react-router-dom';
    import apiClient from "../../path/apiClient";
    import { createGlobalStyle } from 'styled-components';

    const CommunityDetail = () => {
        const navigate = useNavigate();
        const { communityId } = useParams();
        const [post, setPost] = useState(null);
        const [likeCount, setLikeCount] = useState(0);
        const [isLiked, setIsLiked] = useState(false);
        const [commentisLiked, commentsetIsLiked] = useState(false);
        const [comments, setComments] = useState([]);
        const [commentCount, setCommentCount] = useState(0); // 댓글 수 카운트 상태 추가
        const [newComment, setNewComment] = useState('');
        const [showCommentForm, setShowCommentForm] = useState(false);  // 댓글 입력 폼 표시 상태
        const [replyingTo, setReplyingTo] = useState(null);
        const commentFormRef = useRef({});
        const inputRef = useRef({});


        
        const dateTimeFormatOptions = {
          year: 'numeric', month: 'numeric', day: 'numeric',
          hour: '2-digit', minute: '2-digit',
          hour12: false // 24시간 형식
        };

        const formatDateTime = (dateString) => {
          const date = new Date(dateString);
          return date.toLocaleString('ko-KR', dateTimeFormatOptions);
        };

        const toggleCommentForm = () => {
          setShowCommentForm(!showCommentForm);
          if (!showCommentForm) {
            setTimeout(() => {
              const formElement = commentFormRef.current['main'];
              if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const inputElement = inputRef.current['main'];
                if (inputElement) {
                  inputElement.focus();
                }
              }
            }, 0);
          }
        };

        const handleToggleCommentForm = (commentId) => {
          if (commentId) {
              // 답글 작성을 위한 경우
              setShowCommentForm(false);
              setReplyingTo(commentId);
              setTimeout(() => {
                  if (commentFormRef.current[commentId]) {
                      commentFormRef.current[commentId].scrollIntoView({ behavior: 'smooth', block: 'center' });
                      inputRef.current[commentId].focus();
                  }
              }, 0);
          } else {
              // 메인 댓글 작성을 위한 경우
              setShowCommentForm(!showCommentForm);
              if (!showCommentForm) {
                  setTimeout(() => {
                      if (commentFormRef.current['main']) {
                          commentFormRef.current['main'].scrollIntoView({ behavior: 'smooth', block: 'center' });
                          inputRef.current['main'].focus();
                      }
                  }, 0);
              }
          }
      };

        const handleChange = (commentId, value) => {
          setNewComment(prev => ({ ...prev, [commentId]: value }));
        };

        const handleGoBack = () => {
          navigate(-1); // 뒤로가기 기능 실행
        };
      
        const calculateTotalCommentsIncludingReplies = (comments) => {
          return comments.length;
        };

        useEffect(() => {
          async function fetchData() {
              try {
                  const postResponse = await apiClient.get(`/community/${communityId}`);
                  const commentsResponse = await apiClient.get(`/comments/community/${communityId}`);
                  const sortedComments = sortComments(commentsResponse.data); // 데이터 로드 시 댓글 정렬
      
                  // 게시글 데이터 설정
                  setPost(postResponse.data);
                  setLikeCount(postResponse.data.likeCount);
                  setIsLiked(postResponse.data.isLiked);
      
                  // 댓글 데이터 및 댓글 수 설정
                  setComments(sortedComments);
                  setCommentCount(calculateTotalCommentsIncludingReplies(commentsResponse.data));
      
              } catch (error) {
                  console.error('Error fetching data:', error);
              }
          }
          fetchData();
      }, [communityId]);
      
      const handleLike = async () => {
        try {
            const response = isLiked
                ? await apiClient.delete(`/likes/community/${communityId}`)
                : await apiClient.post(`/likes/community/${communityId}`);
    
            if (response.status === 200) {
                setIsLiked(!isLiked);
                setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));
            }
        } catch (error) {
            console.error('Error processing like:', error);
        }
    };
          const submitComment = async (e, commentId) => {
            e.preventDefault();
            const content = newComment[commentId] || '';
            const payload = {
              communityId,
              content,
              ...(commentId !== 'main' && { parentId: commentId })
            };
          
            try {
              const response = await apiClient.post(commentId !== 'main' ? '/comments/reply' : '/comments', payload);
              if (response.status === 200) {
                const newCommentData = response.data;
                // 여기에서 authorPhotoUrl이 포함되어 있는지 확인
                if (!newCommentData.profileUrl) {
                  newCommentData.profileUrl = '/assets/img/Profile.png'; // 기본 이미지 경로
                }
                const updatedComments = sortComments([...comments, newCommentData]);
                setComments(updatedComments);
                setCommentCount(updatedComments.length);
                setNewComment(prev => ({ ...prev, [commentId]: '' })); // 입력 필드 초기화
                setReplyingTo(null);
              }
            } catch (error) {
              console.error('Error submitting comment:', error);
            }
          };
        
        const sortComments = (comments) => {
          let commentMap = new Map();
      
          // 먼저 모든 댓글을 맵에 저장하면서 각 댓글에 빈 children 배열을 초기화
          comments.forEach(comment => {
              commentMap.set(comment.id, {...comment, children: []});
          });
      
          // 자식 댓글을 각각의 부모의 children 배열에 추가
          comments.forEach(comment => {
              if (comment.parentId && commentMap.has(comment.parentId)) {
                  commentMap.get(comment.parentId).children.push(comment);
              }
          });
      
          // 재귀적으로 자식 댓글을 처리하는 함수
          const addCommentWithChildren = (comment, result) => {
              result.push(comment);
              if (comment.children && comment.children.length > 0) {
                  // children이 있고 길이가 0보다 클 때만 정렬하고 추가
                  comment.children.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                  comment.children.forEach(child => addCommentWithChildren(child, result));
              }
          };
      
          // 최상위 댓글만 찾아서 처리
          let sortedComments = [];
          comments.filter(comment => !comment.parentId)
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .forEach(comment => addCommentWithChildren(commentMap.get(comment.id), sortedComments));
      
          return sortedComments;
      };

      const handleCommentLike = async (commentId) => {
        try {
            const comment = comments.find(c => c.id === commentId);
            if (!comment) {
                console.error("Comment not found");
                return;
            }
    
            const response = comment.isLiked
                ? await apiClient.delete(`/likes/comment/${commentId}`)
                : await apiClient.post(`/likes/comment/${commentId}`);
    
            if (response.status === 200) {
                setComments(comments.map(c => 
                    c.id === commentId 
                        ? {...c, isLiked: !c.isLiked, likeCount: c.isLiked ? c.likeCount - 1 : c.likeCount + 1}
                        : c
                ));
            }
        } catch (error) {
            console.error('Error processing comment like:', error);
        }
    };
      
        if (!post) return <div>Loading...</div>;

      return (
        <>
            <GlobalStyle /> 
            <BackButtonContainer>
              <BackButton onClick={handleGoBack}>&lt; 뒤로가기</BackButton> 
            </BackButtonContainer>
            <Container>
              <PostSection>
                <PostTitle>{post.title}</PostTitle>
                <PostContent dangerouslySetInnerHTML={{ __html: post.content }} />
                <AuthorInfo>
                  <AuthorPhoto src={post.profileUrl || '/assets/img/Profile.png'} alt="Profile" />
                  <AuthorName>{post.nickname}</AuthorName>
                  <CommentTimestamp>{formatDateTime(post.createdAt)}</CommentTimestamp>
                </AuthorInfo>
                <LikeAndCommentSection>
                    <LikeButton
                        src={isLiked ? '/assets/img/CheckGoodIcon.png' : '/assets/img/GoodIcon.png'}
                        alt={isLiked ? 'Unlike' : 'Like'}
                        onClick={handleLike}
                    />
                    <span>{likeCount}</span>
                    <CommentButton
                        src={'/assets/img/Comment.png'}
                        onClick={toggleCommentForm}
                    />
                    <span>{commentCount}</span>
                </LikeAndCommentSection>
              </PostSection>
              <Divider />
              <CommentSection>
                {comments.map((comment) => (
                    <div key={comment.id}>
                      <CommentItem key={comment.id} isReply={comment.parentId != null}>
                        <CommentHeader>
                          <CommentAuthorPhoto src={comment.profileUrl || '/assets/img/Profile.png'} alt="Profile" />
                          <CommentAuthorName isReply={comment.parentId != null}>{comment.nickname}</CommentAuthorName>
                        </CommentHeader>
                        <CommentBody>
                          <CommentContent>{comment.content}</CommentContent>
                        </CommentBody>
                        <CommentFooter>
                          <CommentTimestamp>{formatDateTime(comment.createdAt)}</CommentTimestamp>
                          <LikeAndCommentSection>
                            <CommentLikeButton
                              onClick={() => handleCommentLike(comment.id)}
                              src={comment.isLiked ? '/assets/img/CheckGoodIcon.png' : '/assets/img/GoodIcon.png'}
                              alt={comment.isLiked ? 'Unlike' : 'Like'}
                            />
                            <span>{comment.likeCount}</span>
                            {!comment.parentId && (
                              <React.Fragment>
                                <CommentReplyButton
                                  src={'/assets/img/Comment.png'}
                                  onClick={() => handleToggleCommentForm(comment.id)}
                                  alt="Reply"
                                />
                                <span>{comment.replyCount}</span>
                              </React.Fragment>
                            )}
                          </LikeAndCommentSection>
                        </CommentFooter>
                      </CommentItem>
                      {replyingTo === comment.id && (
                        <CommentForm ref={el => commentFormRef.current[comment.id] = el}>
                          <CommentInput
                            ref={el => inputRef.current[comment.id] = el}
                            value={newComment [comment.id] || ''}
                            onChange={e => handleChange(comment.id, e.target.value)}
                          />
                          <SubmitButton onClick={(e) => submitComment(e, comment.id)}>등록</SubmitButton>
                        </CommentForm>
                      )}
                    </div>
                ))}
            </CommentSection>
            {showCommentForm && (  // 조건부 렌더링
                <CommentForm ref={el => commentFormRef.current['main'] = el}>
                  <CommentInput
                      ref={el => inputRef.current['main'] = el}
                      value={newComment['main'] || ''}
                      onChange={e => handleChange('main', e.target.value)}
                  />
                  <SubmitButton onClick={(e) => submitComment(e, 'main')}>등록</SubmitButton>
                </CommentForm>
            )}
            </Container>
        </>
      );
    };

    export default CommunityDetail;

    // Styled Components

    export const GlobalStyle = createGlobalStyle`
      html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          background-color: #000; // body 전체의 배경색을 검은색으로 설정
          font-family: "Pretendard";
      }

      /* 스크롤바 전체 스타일 */
      ::-webkit-scrollbar {
        width: 0.5rem;
      }

      /* 스크롤바 트랙(바탕) 스타일 */
      ::-webkit-scrollbar-track {
        background: transparent; /* 트랙의 배경색 */
      }

      /* 스크롤바 핸들(움직이는 부분) 스타일 */
      ::-webkit-scrollbar-thumb {
        background: #00FFE0; /* 핸들의 배경색 */
        border-radius: 5px;
      }
    `;

    const Container = styled.div`
      background-color: #1e1e1e;
      color: #ffffff;
      border-radius: 10px;
      padding: 20px;
      max-width: 768px;
      margin: 40px auto;
      margin-top: 1rem;
    `;

    const PostSection = styled.div ` 
    `;

    const BackButtonContainer = styled.div`
      margin-left: 20rem;
    `;

    const BackButton = styled.div`
      display: flex;
      cursor: pointer;
      background-color: transparent;
      color: #d9d9d9;
      border: none;
      border-radius: 5px;
      margin-top: 2rem;
      align-self: flex-start;  
      font-family: 'Pretendard';
      font-size: 1.2rem;
    `;

    const PostTitle = styled.div`
      font-family: "Pretendard";
      font-size: 1.9rem;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.05625rem;
      margin-top: 2rem;
      margin-left: 2rem;
    `;

    const PostContent = styled.p`
      color: #FFF;
      font-family: "Pretendard";
      font-size: 1.2rem;
      font-style: normal;
      font-weight: 300;
      line-height: 1.875rem;
      margin-top: 0.5rem;
      margin-left: 2rem;
    `;

    const AuthorInfo = styled.div`
      display: flex;
      align-items: center;
      margin-top: 10px;   // 상단 여백
    `;

    const AuthorPhoto = styled.img`
      width: 1.84569rem;
      height: 1.84569rem;
      border-radius: 50%;
      margin-left: 2rem;
      margin-right: 1rem;
    `;

    const AuthorName = styled.span`
      color: #E1E1E1;
      font-family: 'Pretendard';
      font-size: 1.25rem;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      margin-right: 1rem;
    `;

    const CommentSection = styled.div`
      margin-top: 20px;
      margin-left:2rem;
      margin-right:2rem;
    `;

    const CommentForm = styled.form`
      display: flex;
      margin-top: 1rem;
      margin-bottom: 2rem;
      border-radius: 8px;
    `;

    const CommentInput = styled.textarea`
      flex-grow: 1;
      background-color: #2B2B2B;;
      margin-right: 10px;
      padding: 10px;
      outline: none;
      box-shadow: none;
      color: white;
    `;

    const SubmitButton = styled.button`
      background-color: transparent;
      border: 1px solid white;
      color: #00FFE0;;
      padding: 10px;
      cursor: pointer;
    `;

    const LikeAndCommentSection = styled.div`
      display: flex;
      align-items: center;
      justify-content: flex-end; /* 항목들을 컨테이너의 오른쪽 끝으로 정렬 */
      gap: 1rem;
      margin-top: 1rem;
      margin-bottom: 1rem;
    `;

    const Divider = styled.div`
      width: 105.2%; // 너비를 120%로 설정
      height: 2px; // 높이는 1px
      background-color: #494949; // 색상 설정
      margin-left: -20px;
      margin-right: -20px;
    `;

    const LikeButton = styled.img`
        cursor: pointer;
        width: 1.8125rem;
        height: 1.8125rem;
    `;

    const CommentButton = styled.img`
        cursor: pointer;
        width: 1.8125rem;
        height: 1.8125rem;
    `;

    const CommentHeader = styled.div`
      display: flex;
      align-items: center;
      width: 100%;
    `;

    const CommentBody = styled.div`
      margin-top: 1rem;
      margin-left: rem;
    `;

    const CommentFooter = styled.div`
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 95%;
      margin-top: 5px;
    `;

    const CommentItem = styled.div`
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-top: 2rem;
      border-bottom: 1px solid #333;
      background-color: ${props => props.isReply ? '#2B2B2B' : 'none'};
      margin-left: ${props => props.isReply ? '2rem' : '0'};
    `;

    const CommentAuthorPhoto = styled.img`
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
      padding-left: ${props => props.isReply ? '1rem' : '0'};
      position: relative;
      &:before {
        content: ${props => props.isReply ? "'ㄴ '" : "''"};
        position: absolute;
        left: -1.5rem;
      }
    `;

    const CommentAuthorName = styled.span`
      color: #FFF;
      font-family: "Pretendard";
      font-size: 1.4rem;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    `;

    const CommentContent = styled.div`
      flex-grow: 1;
      color: #fff;
      margin-right: 10px;
    font-family: "Pretendard";
    font-size: 1.375rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.875rem; 
    `;

    const CommentTimestamp = styled.span`
      color: #A9A9A9;
      font-family: "Pretendard";
      font-size: 0.8rem;
      font-style: normal;
      font-weight: 300;
      line-height: 1.625rem;
    `;

    const CommentLikeButton = styled.img`
        cursor: pointer;
        width: 1.8125rem;
        height: 1.8125rem;
    `;

    const CommentReplyButton = styled.img`
      cursor: pointer;
      width: 1.8125rem;
      height: 1.8125rem;
    `;