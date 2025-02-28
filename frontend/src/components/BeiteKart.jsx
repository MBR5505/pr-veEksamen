import beiteområder from '../assets/img/beiteområder.png';
const BeiteKart = () => {
  return (
    <div className="wrapper">
    <img src={beiteområder} alt="kart over beiteområder til rein" useMap="#mymap" /> <map name="mymap">
            <area shape="poly" coords="105,735,142,723,166,691,169,675,237,599,349,561,381,547,295,431,229,364,194,339,35,519,56,679" href="/"></area>
        </map>
    </div>
  )
}

export default BeiteKart