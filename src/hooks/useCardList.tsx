import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

interface cardListType {
  category: string;
  categoryId: number;
  commentCnt: string;
  content: string;
  createdAt: string;
  filesCnt: string;
  id: number;
  imgUrl: string | undefined;
  likeCnt: string;
  title: string;
  userId: number;
  userNickname: string;
  viewCnt: number;
  updatedAt: string;
  postedAt: string;
  deletedAt: string | null;
  statusId: number;
}

export const useCardList = (pageNumber: number, categoryId?: any) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cardList, setCardList] = useState<cardListType[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let query = params.get('query');

  useEffect(() => {
    setCardList([]);
  }, [categoryId?.categoryId]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel: any;
    if (query) {
      axios({
        method: 'GET',
        url: `${BACK_URL}:${BACK_PORT}/search/list`,
        params: { query: query, index: pageNumber },
        cancelToken: new axios.CancelToken(c => {
          cancel = c;
        }),
      })
        .then(res => {
          setCardList(prevCardList => {
            return [...new Set([...prevCardList, ...res.data])];
          });
          setHasMore(res.data.length > 0);
          setLoading(false);
        })
        .catch(e => {
          if (axios.isCancel(e)) {
            return;
          }
          setError(true);
        });
      return () => cancel();
    }
    if (!query) {
      axios({
        method: 'GET',
        url: `${BACK_URL}:${BACK_PORT}/feeds/post`,
        params: { index: pageNumber, categoryId: categoryId.categoryId },
        cancelToken: new axios.CancelToken(c => {
          cancel = c;
        }),
      })
        .then(res => {
          setCardList(prevCardList => {
            return [...new Set([...prevCardList, ...res.data])];
          });
          setHasMore(res.data.length > 0);
          setLoading(false);
        })
        .catch(e => {
          if (axios.isCancel(e)) {
            return;
          }
          setError(true);
        });
      return () => cancel();
    }
  }, [categoryId?.categoryId, pageNumber]);
  return { loading, error, cardList, hasMore };
};
