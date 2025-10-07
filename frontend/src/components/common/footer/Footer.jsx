import style from "./Footer.module.css";

function Footer() {
const data = new Date();
const year = data.getFullYear();


  return (
    <footer className={style.footer}>
      <div className={style.container}>
        <p>&copy; {year} TaskBoost. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
export default Footer;
