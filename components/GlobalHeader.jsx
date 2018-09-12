 const GlobalHeader = (props) => {
   let btnBack = props.hideBtnBack ? '' : <div className="globalHeader__button" onClick={props.handleBackButton}><div>&lt;</div></div>
  return (
    <div className="globalHeader">
      {/* {btnBack} */}
      <div className="globalHeader__title">{props.titleMsg}</div>
    </div>
  )
}
export default GlobalHeader