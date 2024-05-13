import React, { useState, useRef } from "react";

function DragnDrop({ data }) {
  const [list, setList] = useState(data);
  const [dragging, setDragging] = useState(false);
  const [draggingGroup, setDraggingGroup] = useState(null);

  const dragItem = useRef();
  const dragNode = useRef();

  const handletDragStart = (e, params) => {
    dragItem.current = params;
    dragNode.current = e.target;

    dragNode.current.addEventListener("dragend", handelDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnter = (e, targetItem) => {
    const currentItem = dragItem.current;
    if (targetItem.title === "Even" && !isEven(list[currentItem.grpI].items[currentItem.itemI].id)) {
      console.log("Item ID is not even, cannot move to Even column");
      return;
    } else {
      setList((oldList) => {
        let newList = [...oldList];
        newList = newList.map((group) => ({
          ...group,
          items: [...group.items],
        }));
        newList[targetItem.grpI].items.splice(
          targetItem.itemI,
          0,
          newList[currentItem.grpI].items.splice(currentItem.itemI, 1)[0]
        );
        dragItem.current = targetItem;
        return newList;
      });

      setDraggingGroup(targetItem.grpI); // Set the dragging group
    }
  };

  const isEven = (number) => {
    return number % 2 === 0;
  };

  const handelDragEnd = () => {
    setDragging(false);
    setDraggingGroup(null); 
    dragNode.current.removeEventListener("dragend", handelDragEnd);
    dragItem.current = null;
    dragNode.current = null;
  };

  const getStyles = (params) => {
    const currentItem = dragItem.current;
    if (
      currentItem.grpI === params.grpI &&
      currentItem.itemI === params.itemI
    ) {
      return "current dnd-item";
    } else {
      return dragging && draggingGroup === params.grpI
        ? "dnd-item dragging"
        : "dnd-item";
    }
  };

  const handleLoadMore = (grpIndex) => {
    setList((prevList) => {
      const newList = [...prevList];
      newList[grpIndex].showAll = true;
      return newList;
    });
  };

  return (
    <div className="drag-n-drop">
      {list.map((grp, grpI) => (
        <div
          key={grp.title}
          className={
            dragging && draggingGroup === grpI
              ? "dnd-group dragging"
              : "dnd-group"
          }
          onDragEnter={
            dragging && !grp.items.length
              ? (e) => handleDragEnter(e, { grpI, itemI: 0, title: grp.title })
              : null
          }
        >
          <div className="group-title" style={{ backgroundColor: grp.color }}>
            {grp.title}
            <span style={{ marginLeft: '5px' }}>{`(${grp.items.length})`}</span>
          </div>
          {grp.items.length > 0 &&
            grp.items
              .slice(0, grp.showAll ? grp.items.length : 4)
              .map((item, itemI) => (
                <div
                  draggable
                  onDragStart={(e) => {
                    handletDragStart(e, { grpI, itemI });
                  }}
                  onDragEnter={
                    dragging
                      ? (e) => {
                          handleDragEnter(e, { grpI, itemI, title: grp.title });
                        }
                      : null
                  }
                  key={item.id}
                  className={
                    dragging && draggingGroup === grpI
                      ? getStyles({ grpI, itemI })
                      : "dnd-item"
                  }
                >
                  <p>{item.name}</p>
                </div>
              ))}
          {grp.items.length > 4 && !grp.showAll && (
            <button id="btn" onClick={() => handleLoadMore(grpI)}>
              Load More
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default DragnDrop;
