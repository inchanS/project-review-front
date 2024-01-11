import { useEffect, useState } from 'react';
import { CommentTextarea } from 'Components/Feed/Comment/CommentTextarea';
import { useMutation } from '@tanstack/react-query';
import { deleteComment, queryClient } from 'util/feed-http';
import { alertActions } from 'redux/slice/alert-slice';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useParams } from 'react-router-dom';
interface MainCommentProps {
  userId: number;
  nickname: string;
  createdAt: string;
  comment: string;
  isPrivate: boolean;
  deletedAt: string | null;
  isChildren: boolean;
  setIsTextareaOpen: Function;
  isTextareaOpen: boolean;
  commentId: number;
  loginUserId: Number;
}

export const MainComment = ({
  userId,
  nickname,
  createdAt,
  comment,
  isPrivate,
  deletedAt,
  isChildren,
  setIsTextareaOpen,
  isTextareaOpen,
  commentId,
  loginUserId,
}: MainCommentProps) => {
  const [specificComment, setSpecificComment] = useState(comment);
  const [isModify, setIsModify] = useState(false);
  const [clickedCommentId, setClickedCommentId] = useState<number | null>(null);
  const createAtDate = createdAt.slice(0, -8);

  const dispatch = useAppDispatch();
  const alertModal = useAppSelector((state: any) => state.alert);

  const params = useParams();
  const feedId = params.id;

  // 댓글 내용 설정(비밀댓글, 삭제된 댓글)
  useEffect(() => {
    setSpecificComment(comment);
    if (deletedAt) {
      setSpecificComment('삭제된 댓글입니다.');
      return;
    }
    if (isPrivate) {
      comment === '## PRIVATE_COMMENT ##' &&
        setSpecificComment('비밀댓글입니다.');
      return;
    }
  }, [comment, deletedAt, isPrivate]);

  const writeNewNestedReply = () => {
    setIsTextareaOpen(!isTextareaOpen);
  };
  const modifyReply = () => {
    setIsModify(!isModify);
  };

  const { mutate: deleteCommentMutate } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', { commentsFeedId: feedId }],
        exact: true,
      });
    },
  });

  const deleteCommentHandler = (deleteCommentId: number) => {
    setClickedCommentId(deleteCommentId);
    dispatch(
      alertActions.setModal({
        isModalOpen: true,
        contents: '댓글을 삭제하시겠습니까?',
        alertPath: '',
        isQuestion: true,
      })
    );
  };

  useEffect(() => {
    if (alertModal.isClickOk && clickedCommentId !== null) {
      deleteCommentMutate({ commentId: clickedCommentId });
      dispatch(alertActions.setIsClickOk());
    }
  }, [alertModal.isClickOk, deleteCommentMutate, clickedCommentId, dispatch]);

  return (
    <div className="flex flex-col justify-end items-end w-full">
      <div className={`${isChildren ? 'w-95%' : 'w-full'} font-bold`}>
        {(loginUserId !== userId && isPrivate) || deletedAt ? '-' : nickname}
      </div>
      <div className="flex justify-between w-full">
        {isChildren && <div className="w-1 h-auto rounded-md bg-mainsky" />}
        <div
          className={`${
            isChildren ? 'w-95%' : 'w-full'
          } p-4 rounded-md bg-white`}
        >
          <div className="flex justify-between">
            <div className="flex gap-4">
              <span className="text-sm text-buttongray">{createAtDate}</span>
              {isPrivate && deletedAt === null && (
                <div className="w-4 h-4 bg-[url('./assets/images/lock.png')] bg-no-repeat bg-cover" />
              )}
              {!isChildren && (
                <button
                  className="text-sm hover:underline cursor-pointer"
                  onClick={writeNewNestedReply}
                >
                  {isTextareaOpen ? '취소' : '답글 달기'}
                </button>
              )}
            </div>
            {!deletedAt && (
              <div className="flex items-center gap-2">
                {userId === loginUserId && (
                  <>
                    <button
                      className="text-sm hover:text-mainblue cursor-pointer"
                      onClick={modifyReply}
                    >
                      {isModify ? '취소' : '수정'}
                    </button>
                    <span className="text-sm">|</span>
                    <button
                      className="text-sm hover:text-mainred cursor-pointer"
                      onClick={() => deleteCommentHandler(commentId)}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {isModify && !deletedAt ? (
            <CommentTextarea
              isNestedComment={false}
              isModify={true}
              modifyReply={modifyReply}
              commentId={commentId}
              content={specificComment}
              modifyPrivate={isPrivate}
            />
          ) : (
            <div className="mt-2">{specificComment}</div>
          )}
        </div>
      </div>
    </div>
  );
};
