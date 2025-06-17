import Header from "../components/header/Header";
import ContentsWarp from "../components/contentspage/ContentsWrap";
import Footer from "../components/footer/Footer";

function ContentPage() {

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto flex flex-col">
        <Header />
        <ContentsWarp />
        <Footer />
    </div>
  );
}

export default ContentPage;