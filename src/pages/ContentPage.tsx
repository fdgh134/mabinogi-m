import Header from "../components/header/Header";
import ContentsWarp from "../components/contentspage/ContentsWrap";

function ContentPage() {

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto flex flex-col">
        <Header />
        <ContentsWarp />
    </div>
  );
}

export default ContentPage;