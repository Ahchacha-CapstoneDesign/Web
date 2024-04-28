import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import apiClient from "../../path/apiClient";
import { createGlobalStyle } from 'styled-components';

const CommunityDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
  
    useEffect(() => {
      const fetchPostAndLikes = async () => {
        try {
          const response = await apiClient.get(`/community/${id}`);
          setPost(response.data);
          setLikeCount(response.data.likeCount);
          // setIsLiked(...) // isLiked 상태도 서버에서 받아와야 합니다.
        } catch (e) {
          console.error('Error fetching post:', e);
        }
      };
  
      const fetchComments = async () => {
        try {
          const response = await apiClient.get(`/comments/community/${id}`);
          setComments(response.data);
        } catch (e) {
          console.error('Error fetching comments:', e);
        }
      };
  
      fetchPostAndLikes();
      fetchComments();
    }, [id]);
  
    const handleLike = async () => {
      try {
        if (!isLiked) {
          await apiClient.post(`/hearts/community/${id}`);
          setLikeCount((prev) => prev + 1);
        } else {
          await apiClient.delete(`/hearts/community/${id}`);
          setLikeCount((prev) => prev - 1);
        }
        setIsLiked(!isLiked);
      } catch (e) {
        console.error('Error handling like:', e);
      }
    };
  
    const submitComment = async (e) => {
      e.preventDefault();
      try {
        const response = await apiClient.post('/comments', {
          communityId: id,
          content: newComment,
        });
        setComments([...comments, response.data]);
        setNewComment('');
      } catch (e) {
        console.error('Error submitting comment:', e);
      }
    };
  
    if (!post) return <div>Loading...</div>;

  return (
    <>
        <GlobalStyle /> 
        <Container>
        <PostTitle>{post.title}</PostTitle>
        <PostContent>{post.content}</PostContent>
        <LikeAndCommentSection>
            <span>Likes: {likeCount}</span>
            <button onClick={handleLike}>{isLiked ? 'Unlike' : 'Like'}</button>
        </LikeAndCommentSection>
        <CommentSection>
            <CommentForm onSubmit={submitComment}>
            <CommentInput
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
            />
            <SubmitButton type="submit">Submit</SubmitButton>
            </CommentForm>
            {comments.map((comment) => (
            <div key={comment.id}>{comment.content}</div>
            ))}
        </CommentSection>
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
`;

const PostTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const PostContent = styled.p`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const LikeAndCommentSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const CommentSection = styled.div`
  margin-top: 20px;
`;

const CommentForm = styled.form`
  display: flex;
  margin-bottom: 20px;
`;

const CommentInput = styled.textarea`
  flex-grow: 1;
  margin-right: 10px;
  padding: 10px;
`;

const SubmitButton = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
`;