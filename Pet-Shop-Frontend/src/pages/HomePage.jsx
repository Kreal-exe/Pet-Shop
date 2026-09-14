import Hero from "../components/Hero";
import Discount from "../components/Discount";
import Categories from "./Categories";
import DiscountProducts from "./DiscountProducts";

const HomePage = () => {

  return (
    <main>
      <Hero />
      <Categories limit={4} shortPath ={true} />
    <Discount />
    <DiscountProducts limit={4} shortPath ={true} />
    </main>
  );
};

export default HomePage;