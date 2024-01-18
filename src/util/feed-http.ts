import axios from 'axios';
import LikeIconImg from '../assets/images/thumbsUp.png';
import DoubleLikeImg from '../assets/images/double-like.png';
import DisLikeImg from '../assets/images/dislike.png';
import instance from 'api';

const BACK_URL = process.env.REACT_APP_BACK_URL;

// 메인페이지 - 전체 / 검색(무한스크롤)
interface mainFeedType {
  pageParam: number;
  query?: string | null;
  categoryId?: number | null;
  signal: AbortSignal;
}
export const getMainFeedList = async ({
  pageParam,
  query,
  categoryId,
  signal,
}: mainFeedType) => {
  try {
    if (query) {
      const response = await axios({
        method: 'GET',
        url: `${BACK_URL}/search/list`,
        params: { query: query, index: pageParam },
        timeout: 5000,
        signal,
      });
      return response.data;
    }
    if (!query) {
      const response = await axios({
        method: 'GET',
        url: `${BACK_URL}/feeds/post`,
        params: {
          index: pageParam,
          categoryId: categoryId,
          limit: 10,
        },
        timeout: 5000,
        signal,
      });
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

// 게시물 작성 페이지 - 카테고리 불러오기
export interface CategoryType {
  id: number;
  category: string;
}

export const getCategory = async ({ signal }: { signal: AbortSignal }) => {
  try {
    const response = await axios.get<CategoryType[]>(`${BACK_URL}/categories`, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
      signal,
    });
    return [{ id: 0, category: '카테고리 선택' }, ...response.data];
  } catch (error) {
    throw error;
  }
};

// 게시물 작성 페이지 - 좋아요 불러오기
export interface EstimationType {
  id: number;
  estimation: string;
  img: string;
}

export const getEstimation = async ({ signal }: { signal: AbortSignal }) => {
  try {
    const response = await axios.get<EstimationType[]>(
      `${BACK_URL}/feeds/estimations`,
      {
        timeout: 5000,
        signal,
      }
    );
    const imgList: string[] = [DoubleLikeImg, LikeIconImg, DisLikeImg];
    const result = response.data.map((estimation, index) => ({
      ...estimation,
      img: imgList[index],
    }));

    return result;
  } catch (error) {
    throw error;
  }
};

// 게시글 수정인 경우 불러오는 피드 데이터
interface ModifyDataType {
  result: {
    category: { id: number; category: string };
    content: string;
    created_at: string;
    estimation: { estimation: string; id: number };
    id: number;
    posted_at: string;
    status: {
      id: number;
      is_status: string;
    };
    title: string;
    updated_at: string;
    uploadFiles: [
      {
        id: number;
        is_img: boolean;
        file_link: string;
        file_name: string;
        file_size: string;
      }
    ];
    length: number;
    user: {
      id: number;
      nickname: string;
    };
    viewCnt: number;
  };
}

export const getModifyFeedData = async ({
  feedId,
}: {
  feedId: string | undefined;
}) => {
  try {
    const response = await instance.get<ModifyDataType>(
      `${BACK_URL}/feeds/${feedId}`
    );
    return response.data.result;
  } catch (error) {
    throw error;
  }
};

// 임시저장 POSt
interface SaveResultType {
  message: string;
  result: {
    id: number;
    created_at: string;
    updated_at: string;
    user: {
      id: number;
      created_at: string;
      updated_at: string;
      deleted_at: string;
      nickname: string;
      email: string;
    };
    title: string;
    content: string;
    category: number;
    posted_at: string;
    feedSymbol: [];
    uploadFiles: [
      [
        {
          id: 1;
          created_at: string;
          updated_at: string;
          deleted_at: string;
          is_img: boolean;
          file_link: string;
        }
      ]
    ];
  };
}
export const postSave = async (
  titleValue: string,
  contentValue: string,
  selectedLike: number | undefined,
  selectCategory: number | undefined,
  fileLink: string[]
) => {
  try {
    const response = await instance.post<SaveResultType>(
      `${BACK_URL}/feeds/temp`,
      {
        title: titleValue,
        content: contentValue,
        estimation: selectedLike,
        category: selectCategory,
        fileLinks: fileLink,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 임시저장 patch
export const patchSave = async (
  feedId: number,
  titleValue: string,
  contentValue: string,
  selectedLike: number | undefined,
  selectCategory: number | undefined,
  fileLink: string[]
) => {
  try {
    const response = await instance.patch<SaveResultType>(
      `${BACK_URL}/feeds/temp`,
      {
        feedId: feedId,
        title: titleValue,
        content: contentValue,
        estimation: selectedLike,
        category: selectCategory,
        fileLinks: fileLink,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 게시글 등록 / 수정
// feedId가 없으면 등록, 있으면 수정

export interface sendFeedType {
  feedId?: number;
  title: string;
  content: string;
  estimation: number;
  category: number;
  fileLinks: string[] | undefined | null;
}
export const sendFeed = async ({
  feedId,
  title,
  content,
  estimation,
  category,
  fileLinks,
}: sendFeedType) => {
  try {
    if (feedId !== 0) {
      const response = await instance.patch<SaveResultType>(`/feeds/post`, {
        feedId,
        title,
        content,
        estimation,
        category,
        fileLinks,
      });
      return response.data;
    }
    const response = await instance.post<SaveResultType>(`/feeds/post`, {
      title,
      content,
      estimation,
      category,
      fileLinks,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 게시글 삭제
export const deleteFeed = async (feedId: string | undefined) => {
  try {
    const response = await instance.delete<string>(
      `${BACK_URL}/feeds/${feedId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
