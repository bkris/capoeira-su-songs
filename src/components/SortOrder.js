/**
 * @param onSortByName
 * @param onSortByDate
 * @return {JSX.Element}
 * @constructor
 */
function SortOrder({onSortByName, onSortByDate}) {
  return (
    <div className="pb-3">
      <button className="btn" onClick={onSortByName}>Sort By Name</button>
      <button className="btn" onClick={onSortByDate}>Sort By Date</button>
    </div>
  );
}

export default SortOrder;
