import React, { Fragment, useEffect, useRef, useState } from 'react';
import Styled from 'styled-components';
import { flexCenterAlign, ButtonLayout } from 'Styles/CommonStyle';
import ToggleImg from '../../assets/images/toggleDown.png';
import LikeIconImg from '../../assets/images/thumbsUp.png';
import DoubleLikeImg from '../../assets/images/double-like.png';
import DisLikeImg from '../../assets/images/dislike.png';
import QuestionMark from '../../assets/images/question.png';
import FileIconImg from '../../assets/images/clip.png';
import axios, { AxiosResponse } from 'axios';

const TitleDiv = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = Styled.h1`
  font-size: 1.6em;
  font-weight: 700;
  margin-bottom: 2em;
`;

const MenuContainer = Styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  gap: 1em;
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CategoryButton = Styled.div`
  display: flex;
  justify-content: space-between;
  width: 10em;
  padding: 0.8em;
  border: 1px solid #f1f1f1;
  border-radius: 0.3em;
  cursor: pointer;
`;

const CategorySelectBox = Styled.ul<{ isToggleOpen: boolean }>`
  display: ${props => (props.isToggleOpen ? 'block' : 'none')};
  position: absolute;
  width: 10em;
  margin-top: 18em;
  padding: 1em;
  background-color: #fff;
  border: 1px solid #EDEDED;
  border-radius: 0.3em;
  @media (max-width: 767px) {
    margin-top: 3em;
  }
`;

const ToggleButton = Styled.img<{ isToggleOpen: boolean }>`
  width: 1em;
  margin-left: 0.5em;
  transform: ${props => props.isToggleOpen === true && 'rotateZ(-60deg)'};
`;

const CategoryItem = Styled.li`
  padding: 0.5em;
  cursor: pointer;
  &:hover {
    color: #676FA3;
  }
`;

const ActiveItem = Styled.li`
  padding: 0.5em;
  font-weight: 700;
`;

const UploadButton = Styled.button`
  ${ButtonLayout}
  padding: 0.2em;
  cursor: pointer;
`;

const FileInput = Styled.input`
  visibility: hidden;
  position: absolute;
`;

const ContentsContainer = Styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2em;
`;

const InputDiv = Styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid #f1f1f1;
  border-radius: 0.3em;
`;

const TitleInput = Styled.input`
  width: 90%;
  padding: 0.3em 1em;
  font-size: 1.3em;
  border: none;
  outline: none;
  &::placeholder {
    color: #c1c1c1;
  }
`;

const ImgPreview = Styled.div`
  ${flexCenterAlign}
  padding: 1em;
  gap: 0.5em;
  border: 1px solid #f1f1f1;
  border-radius: 0.3em;
  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

const ImgPreviewMessage = Styled.div`
  display: flex;
  color: #c1c1c1;
  font-size: 1.2em;
`;

const FilePreviewDiv = Styled.div`
  ${flexCenterAlign}
  flex-direction: column;
  gap: 0.5em;
`;

const ImgPreviewItem = Styled.img<{ isFile: boolean }>`
  max-width: ${props => (props.isFile ? '7em' : '12em')};
  max-height: ${props => (props.isFile ? '5em' : '8em')};
  cursor: pointer;
`;

const ContentTextarea = Styled.textarea`
  width: 95%;
  height: 25em;
  padding: 1em;
  border: none;
  outline: none;
  &::placeholder {
    color: #c1c1c1;
  }
  resize: none;
`;

const Buttons = Styled.div`
  display: flex;
  width: 100%;
  margin-top: 1em;
  justify-content: flex-end;
  gap: 1em;
`;

const Button = Styled.button<{ isSave: boolean }>`
  ${ButtonLayout}
  padding: 0.1em 1em;
  background-color: ${props => (props.isSave ? '#C1C1C1' : '#FF5959')};
  color: ${props => (props.isSave ? '#000' : '#fff')};
  cursor: pointer;
`;

const SaveAlertDiv = Styled.div<{ isSaved: string; isNotNull: boolean }>`
visibility: ${props => (props.isSaved === 'true' ? 'visible' : 'hidden')};
  position: absolute;
  padding: 0.3em;
  right: 20em;
  color: #fff;
  background-color: ${props => (props.isNotNull ? '#CDDEFF' : '#FF5959')};
  border-radius: 0.3em;
  animation-name: ${props =>
    props.isSaved === 'true'
      ? 'alertOpen'
      : props.isSaved === 'false'
      ? 'alertClose'
      : 'none'};
  animation-direction: alternate;
  animation-duration: 300ms;

  @keyframes alertOpen {
    from {
      visibility: hidden;
      opacity: 0;
    }
    50% {
      visibility:visible;
    }
    to{
      visibility: visible;
      opacity: 1;
    }
  }

  @keyframes alertClose {
    from {
      visibility: visible;
      opacity: 1;
    }
    50% {
      visibility:visible;
    }
    to{
      visibility: hidden;
      opacity: 0;
    }
  }

  @keyframes none {
    0% {
      display: none;
    }
    100% {
      display: none;
    }
  }
`;

const RadioContainer = Styled.div`
  display: flex;
  gap: 1em;
`;

const RadioButton = Styled.label`
  ${flexCenterAlign}
  flex-direction: column;
  cursor: pointer;
`;

const RadioImg = Styled.img`
  width: 1.5em;
  cursor: pointer;
`;

const QuestionDiv = Styled.div<{ isQuestionOpen: boolean }>`
  display: ${props => (props.isQuestionOpen ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.3em;
  position: absolute;
  padding: 1em;
  background-color: #fff;
  font-size: 0.8em;
  border: 1px solid #b1b1b1;
  border-radius: 0.3em;
`;

const InfoDiv = Styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.4em;
  margin-top: 1em;
  font-size: 0.8em;
  color: #b1b1b1;
`;

const Count = Styled.span<{ textLength: number; maxLength: number }>`
  color: ${props => props.textLength === props.maxLength && '#FF5959'};
  align-self: flex-end;
  font-size: 0.8em;
  padding: 0.2em;
`;

const WarningMessage = Styled.p`
  color: #FF5959;
`;

interface CategoryType {
  id: number;
  category: string;
}

interface FileLinkType {
  file_link: string[];
}

interface PreviewType {
  id: number;
  url: string;
  name: string;
}

export const WriteContainer = () => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [categoryName, setCategoryName] = useState('카테고리');
  const [categoryId, setCategoryId] = useState(0);
  const [countIdx, setCountIdx] = useState(0);
  const [mainFileList, setMainFileList] = useState<File[]>([]);
  const [previewList, setPreviewList] = useState<PreviewType[]>([]);
  const [isSaved, setIsSaved] = useState('none');
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [titleLength, setTitleLength] = useState(0);
  const [content, setContent] = useState('');
  const [contentLength, setContentLength] = useState(0);
  const [selectedLike, setSelectedLike] = useState(1);
  const [isNotNull, setIsNotNull] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFileSizePass, setIsFileSizePass] = useState(true);
  const [isFileCountPass, setIsFileCountPass] = useState(true);

  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  useEffect(() => {
    fetch(`${BACK_URL}:${BACK_PORT}/categories`, {
      headers: requestHeaders,
    })
      .then(res => res.json())
      .then(json => {
        setCategoryList([{ id: 0, category: '카테고리' }, ...json]);
      });
  }, []);

  useEffect(() => {
    if (title && content) {
      setIsNotNull(true);
      return;
    }
    if (title === '' || content === '') {
      setIsNotNull(false);
      return;
    }
  }, [title, content]);

  const getTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleLength(e.target.value.length);
    setTitle(e.target.value);
  };
  const getContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentLength(e.target.value.length);
    setContent(e.target.value);
  };

  const handleToggle = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  const handleClickIndex = (e: React.MouseEvent, idx: number) => {
    setCountIdx(idx);
  };

  const input = useRef<HTMLInputElement>(null);

  const formData = new FormData();

  const getFileList = (e: React.ChangeEvent<HTMLInputElement>) => {
    const FILE_SIZE = 5 * 1024 * 1024;
    if (e.target.files) {
      let files: File[] = [...e.target?.files];
      let passFiles: File[] = [];
      files.forEach(file => {
        if (file.size > FILE_SIZE) {
          setIsFileSizePass(false);
          return;
        }
        passFiles.push(file);
      });
      if (passFiles.length > 5) {
        setIsFileCountPass(false);
        passFiles.slice(0, 5);
        return;
      }
      setIsFileCountPass(true);
      setMainFileList(passFiles);
    }
  };

  let token = localStorage.getItem('token');

  useEffect(() => {
    setIsLoading(true);
    mainFileList.forEach(file => {
      formData.append('file', file);
    });
    axios
      .post<FileLinkType>(`${BACK_URL}:${BACK_PORT}/upload`, formData, {
        headers: { Accept: `multipart/form-data`, Authorization: token },
      })
      .then(response => {
        setIsLoading(false);
        let arr: PreviewType[] = [];
        for (let i = 0; i < response.data.file_link.length; i++) {
          const obj = {
            id: i + 1,
            url: response.data.file_link[i],
            name: mainFileList[i].name,
          };
          arr.push(obj);
        }
        setPreviewList(arr);
      })
      .catch(() => {
        alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      });
  }, [mainFileList]);

  useEffect(() => {
    const showMessage = setInterval(() => {
      setIsSaved('true');
      setTimeout(() => {
        setIsSaved('false');
      }, 3000);
    }, 60000);

    return () => clearInterval(showMessage);
  }, []);

  const QuestionDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeClickOutside = (e: any) => {
      if (
        QuestionDivRef.current &&
        !QuestionDivRef.current.contains(e.target as Node)
      ) {
        setIsQuestionOpen(false);
      }
    };
    document.addEventListener('click', closeClickOutside);
    return () => {
      document.removeEventListener('click', closeClickOutside);
    };
  }, [QuestionDivRef]);

  const previewFiles = () => {
    const allowExtensions = ['jpg', 'png', 'jpeg', 'gif'];

    return (
      mainFileList.length !== 0 &&
      previewList.map(item => {
        const extension = item.url.split('.').pop();
        if (!extension) {
          return null;
        }
        return allowExtensions.includes(extension) ? (
          <ImgPreviewItem
            key={item.id}
            src={item.url}
            alt={item.id + '번째 이미지'}
            isFile={false}
          />
        ) : (
          <FilePreviewDiv key={item.id}>
            <ImgPreviewItem
              src={FileIconImg}
              alt="파일 미리보기 아이콘"
              isFile={true}
            />
            <span>{item.name}</span>
          </FilePreviewDiv>
        );
      })
    );
  };

  return (
    <Fragment>
      <TitleDiv>
        <Title>게시글 작성</Title>
        <SaveAlertDiv isSaved={isSaved} isNotNull={isNotNull}>
          {isNotNull ? '임시저장되었습니다.' : '제목과 내용을 입력해주세요.'}
        </SaveAlertDiv>
      </TitleDiv>
      <MenuContainer>
        <CategoryButton onClick={handleToggle}>
          {categoryName}
          <ToggleButton
            src={ToggleImg}
            alt="토글버튼"
            isToggleOpen={isToggleOpen}
          />
        </CategoryButton>
        <CategorySelectBox isToggleOpen={isToggleOpen}>
          {categoryList.map((category: CategoryType, idx: number) => {
            return idx !== countIdx ? (
              <CategoryItem
                key={category.id}
                value={category.id}
                onClick={e => {
                  setCategoryName(category.category);
                  setIsToggleOpen(false);
                  setCategoryId(category.id);
                  handleClickIndex(e, idx);
                }}
              >
                {category.category}
              </CategoryItem>
            ) : (
              <ActiveItem
                key={category.id}
                value={category.id}
                onClick={e => {
                  setCategoryName(category.category);
                  setIsToggleOpen(true);
                  setCategoryId(category.id);
                  handleClickIndex(e, idx);
                }}
              >
                {category.category}
              </ActiveItem>
            );
          })}
        </CategorySelectBox>
        <UploadButton
          onClick={() => {
            input.current?.click();
          }}
        >
          파일 선택
        </UploadButton>
        <FileInput
          type="file"
          ref={input}
          onChange={e => {
            getFileList(e);
          }}
          multiple
        />
        <RadioContainer>
          <RadioButton>
            <RadioImg src={DoubleLikeImg} alt="매우좋아요 선택하기" />
            <input
              type="radio"
              value="1"
              name="select"
              defaultChecked
              onInput={() => {
                setSelectedLike(1);
              }}
            />
          </RadioButton>
          <RadioButton>
            <RadioImg src={LikeIconImg} alt="좋아요 선택하기" />
            <input
              type="radio"
              value="2"
              name="select"
              onInput={() => {
                setSelectedLike(2);
              }}
            />
          </RadioButton>
          <RadioButton>
            <RadioImg src={DisLikeImg} alt="별로예요 선택하기" />
            <input
              type="radio"
              value="3"
              name="select"
              onInput={() => {
                setSelectedLike(3);
              }}
            />
          </RadioButton>
        </RadioContainer>
        <div ref={QuestionDivRef}>
          <RadioImg
            src={QuestionMark}
            alt="도움말"
            onClick={() => {
              setIsQuestionOpen(!isQuestionOpen);
            }}
          />
          <QuestionDiv isQuestionOpen={isQuestionOpen}>
            <p>리뷰하는 주제에 대한 평가를 선택해주세요.</p>
            <p>매우 좋아요 / 좋아요 / 별로예요</p>
          </QuestionDiv>
        </div>
      </MenuContainer>
      <InfoDiv>
        <p>• 여러 파일 업로드 시 Ctrl키를 누른 상태로 이미지를 선택해주세요.</p>
        <p>• 이미지는 png / jpg / jpeg / gif 확장자만 가능합니다.</p>
        <p>• 최대 5장, 각 이미지는 5MB까지 업로드가 가능합니다.</p>
        <p>• 아래 이미지를 클릭하면 삭제할 수 있습니다.</p>
        {isFileSizePass === false && (
          <WarningMessage>• 파일 용량을 확인해주세요!</WarningMessage>
        )}
        {isFileCountPass === false && (
          <WarningMessage>• 파일 개수를 확인해주세요!</WarningMessage>
        )}
      </InfoDiv>
      <ContentsContainer>
        <InputDiv>
          <TitleInput
            type="text"
            placeholder="제목을 입력해주세요."
            onInput={getTitle}
            maxLength={30}
          />
          <Count maxLength={30} textLength={titleLength}>
            {titleLength} / 30
          </Count>
        </InputDiv>

        <ImgPreview>
          {mainFileList.length === 0 && (
            <ImgPreviewMessage>파일 미리보기</ImgPreviewMessage>
          )}
          {mainFileList.length !== 0 && isLoading && (
            <ImgPreviewMessage>Loading...</ImgPreviewMessage>
          )}
          {previewFiles()}
        </ImgPreview>
        <InputDiv>
          <ContentTextarea
            placeholder="내용을 입력해주세요."
            onInput={getContent}
            maxLength={10000}
          />
          <Count maxLength={10000} textLength={contentLength}>
            {contentLength} / 10000
          </Count>
        </InputDiv>
      </ContentsContainer>
      <Buttons>
        <Button isSave={true}>임시저장</Button>
        <Button isSave={false}>등록</Button>
      </Buttons>
    </Fragment>
  );
};
