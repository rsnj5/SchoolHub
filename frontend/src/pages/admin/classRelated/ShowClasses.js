import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import TableTemplate from '../../../components/TableTemplate';
import Popup from '../../../components/Popup';
import '../../styles/ShowClasses.css';

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector(state => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const sclassColumns = [
    { id: 'name', label: 'Class Name', minWidth: 170 },
  ];

  const sclassRows = sclassesList?.map((sclass) => ({
    name: sclass.sclassName,
    id: sclass._id,
  })) || [];

  const SclassButtonHaver = ({ row }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowDropdown(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const handleAddClick = (e) => {
      e.stopPropagation();
      setShowDropdown(!showDropdown);
    };

    const handleActionClick = (action) => {
      setShowDropdown(false);
      action();
    };

    const actions = [
      { 
        name: 'Add Subjects', 
        action: () => navigate(`/Admin/addsubject/${row.id}`) 
      },
      { 
        name: 'Add Student', 
        action: () => navigate(`/Admin/class/addstudents/${row.id}`) 
      },
    ];

    return (
      <div className="button-container" ref={dropdownRef}>
        <button 
          className="action-button delete-button"
          onClick={(e) => {
            e.stopPropagation();
            deleteHandler(row.id, "Sclass");
          }}
        >
          Delete
        </button>
        <button 
          className="action-button view-button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/Admin/classes/class/${row.id}`);
          }}
        >
          View
        </button>
        <div className="dropdown-container">
          <button 
            className="action-button add-button"
            onClick={handleAddClick}
          >
            Add
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              {actions.map((action, index) => (
                <button
                  key={index}
                  className="dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick(action.action);
                  }}
                >
                  {action.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const FloatingActionMenu = () => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setShowMenu(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const actions = [
      { 
        name: 'Add New Class', 
        action: () => navigate("/Admin/addclass") 
      },
      { 
        name: 'Delete All Classes', 
        action: () => deleteHandler(adminID, "Sclasses") 
      },
    ];

    return (
      <div className="floating-action-container" ref={menuRef}>
        <button 
          className="floating-action-button"
          onClick={() => setShowMenu(!showMenu)}
        >
          +
        </button>
        {showMenu && (
          <div className="floating-action-menu">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`floating-menu-item ${action.name.includes('Delete') ? 'delete' : ''}`}
                onClick={() => {
                  setShowMenu(false);
                  action.action();
                }}
              >
                {action.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="show-classes-container">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">Error loading classes</div>
      ) : (
        <>
          {getresponse ? (
            <div className="add-class-container">
              <button 
                className="primary-button"
                onClick={() => navigate("/Admin/addclass")}
              >
                Add Class
              </button>
            </div>
          ) : (
            <>
              {sclassesList?.length > 0 ? (
                <TableTemplate 
                  buttonHaver={SclassButtonHaver} 
                  columns={sclassColumns} 
                  rows={sclassRows} 
                />
              ) : (
                <div className="no-classes">
                  <p>No classes found</p>
                  <button 
                    className="primary-button"
                    onClick={() => navigate("/Admin/addclass")}
                  >
                    Add Your First Class
                  </button>
                </div>
              )}
              <FloatingActionMenu />
            </>
          )}
        </>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  );
};

export default ShowClasses;