import { Link } from 'react-router-dom';
import './ShoppingListOverview.css';

function ShoppingListOverview({ lists }) {
  return (
    <div className="overview-container">
      <h2>Moje nákupní seznamy</h2>
      <div className="lists-grid">
        {lists.map(list => (
          <Link to={`/list/${list.id}`} key={list.id} className="list-card">
            <h3>{list.name}</h3>
            <div className="list-stats">
              <span>Položek: {list.items.length}</span>
              <span>Vyřešeno: {list.items.filter(item => item.resolved).length}</span>
              <span>Členů: {list.members.length}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ShoppingListOverview;