'use client'
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./App.css";
import Box from "@/components/Box";
const initialColumns = [
  { "id": "suggestions",
  "name": "Forslag",
  "items": [
    {
      "name": "Lavere hastigheden i byen",
      "amount": 53.33,
      "backgroundColor": "rgba(81, 158, 138, 0.4)",
      "id": "id-0",
      "co2": 16000,
      "info": "Fartgrænser sænkes med 20 kilometer i timen"
    },
    {
      "name": "Lavere hastighed på Fynske Motorvej",
      "amount": 46.66,
      "backgroundColor": "rgba(100, 100, 100, 1)",
      "id": "id-1",
      "co2": 14000,
      "info": "Fartgrænsen sænkes til 90 kilometer i timen"
    },
    {
      "name": "Bedre kollektiv trafik",
      "amount": 30,
      "backgroundColor": "rgba(81, 158, 138, 0.6)",
      "id": "id-2",
      "co2": 9000,
      "info": "Separate busbaner og flere afgange"
    },
    {
      "name": "Non-road",
      "amount": 33.33,
      "backgroundColor": "rgba(81, 158, 138, 0.75)",
      "id": "id-3",
      "co2": 10000,
      "info": "Indkøb af maskiner, der fremmer grøn omstilling"
    },
    {
      "name": "Klimavenlige byområder",
      "amount": 66.66,
      "backgroundColor": "rgba(81, 158, 138, 0.9)",
      "id": "id-4",
      "co2": 20000,
      "info": "Flere zoner til fodgængere og cyklister, især omkring skoler"
    },
    {
      "name": "Elektrificering og parkering",
      "amount": 70,
      "backgroundColor": "rgba(81, 158, 138, 1)",
      "id": "id-5",
      "co2": 21000,
      "info": "40 procent af biler skal være elbiler samt elbilparkeringspladser"
    },
    {
      "name": "Samkørsel og delebiler",
      "amount": 33.33,
      "backgroundColor": "rgba(81, 158, 138, 0.75)",
      "id": "id-6",
      "co2": 10000,
      "info": "Fremme samkørsel og parkeringspladser til delebiler"
    },
    {
      "name": "Trafikøer",
      "amount": 60,
      "backgroundColor": "rgba(81, 158, 138, 0.6)",
      "id": "id-7",
      "co2": 18000,
      "info": "Vejlukninger, så bilister skal ud på de store veje for at køre på tværs af områder"
    },
    {
      "name": "Trafikøer uden for Ring 2",
      "amount": 43.33,
      "backgroundColor": "rgba(81, 158, 138, 0.45)",
      "id": "id-8",
      "co2": 13000,
      "info": "Vejlukninger uden for ringvejen omkring byen, så bilister ikke kan køre mellem områderne"
    },
    {
      "name": "Nulemissionszoner inden for Ring 2",
      "amount": 153.33,
      "backgroundColor": "rgba(81, 158, 138, 1)",
      "id": "id-9",
      "co2": 46000,
      "info": "Områder, hvor benzin- og hybridbiler ikke må køre ind"
    }
  ]
  },
  {
    id: "stack",
    name: "Din plan",
    items: []
  }

]




function App() {
  const [plans, setPlans] = useState(initialColumns);
  const [totalCO2, setTotalCO2] = useState(0);
  const [selectedItemInfo, setSelectedItemInfo] = useState(null);

  const handleDragAndDrop = (results) => {
    const { source, destination, type } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const reorderedPlans = [...plans];

      const planSourceIndex = source.index;
      const planDestinatonIndex = destination.index;

      const [removedPlan] = reorderedPlans.splice(planSourceIndex, 1);
      reorderedPlans.splice(planDestinatonIndex, 0, removedPlan);

      return setPlans(reorderedPlans);
    }
    const itemSourceIndex = source.index;
    const itemDestinationIndex = destination.index;

    const planSourceIndex = plans.findIndex(
      (plan) => plan.id === source.droppableId
    );
    const planDestinationIndex = plans.findIndex(
      (plan) => plan.id === destination.droppableId
    );

    const newSourceItems = [...plans[planSourceIndex].items];
    const newDestinationItems =
      source.droppableId !== destination.droppableId
        ? [...plans[planDestinationIndex].items]
        : newSourceItems;

    const [deletedItem] = newSourceItems.splice(itemSourceIndex, 1);
    newDestinationItems.splice(itemDestinationIndex, 0, deletedItem);

    const newPlans = [...plans];

    newPlans[planSourceIndex] = {
      ...plans[planSourceIndex],
      items: newSourceItems,
    };
    newPlans[planDestinationIndex] = {
      ...plans[planDestinationIndex],
      items: newDestinationItems,
    };

    

    setPlans(newPlans);

    if (
      source.droppableId === "suggestions" &&
      destination.droppableId === "stack"
    ) {
      setSelectedItemInfo(null)
      const addedItem = newDestinationItems[itemDestinationIndex];
      setTotalCO2((prevTotalCO2) => prevTotalCO2 + addedItem.co2);
      setSelectedItemInfo(addedItem)
    } else if (
      source.droppableId === "stack" &&
      destination.droppableId === "suggestions"
    ) {
      const removedItem = deletedItem;
      setTotalCO2((prevTotalCO2) => prevTotalCO2 - removedItem.co2);
      setSelectedItemInfo(null)
    }

  };

  return (
    <div>
      <div className="game-container">
        <div>
          <DragDropContext onDragEnd={handleDragAndDrop}>
            <div className="header">
              <h1>Hvordan skal din klimaplan se ud?</h1>
            </div>
            <div className="total-co2">Tons CO2 sparet årligt: <span
              className={
                totalCO2 < 100000 ? "text-red-500 font-bold" : "text-green-700 font-bold"
              }
            >
              {totalCO2}
            </span></div>
            <div className="info-besparelse">
              {selectedItemInfo && (
                <>
                  <p><b>Tiltag:</b> <big style={{color:selectedItemInfo.backgroundColor}}>{selectedItemInfo.name}</big></p>
                  <p><b>Info:</b> {selectedItemInfo.info}</p>
                  <p><b>Besparelse:</b> {selectedItemInfo.co2} ton CO2 årligt</p>
                </>
              )}
            </div>
            <Droppable droppableId="ROOT" type="group">
              {(provided) => (
                <div className="flex" {...provided.droppableProps} ref={provided.innerRef}>
                  {plans.map((plan, index) => (
                    <div className="w-1/2" key={plan.id}>
                      <PlanList {...plan} setSelectedItemInfo={setSelectedItemInfo} />
                    </div>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

function PlanList({ name, items, id, setSelectedItemInfo}) {

  const [ selectedItemId, setSelectedItemId] = useState(null)
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });


  const handleItemClick = (item, id) => {
    setSelectedItemInfo(item);
    setSelectedItemId(item.id)
  };


  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setPosition({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - position.x;
    const deltaY = touch.clientY - position.y;

    setPosition({ x: touch.clientX, y: touch.clientY });
    // Update the element's position here using deltaX and deltaY
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };


  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          className="min-h-[800px] bg-gray-100 p-4 rounded-lg text-center"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <div className="plan-container flex">
            <h3 className="box-header">{name}</h3>
          </div>
          <div>
            {items.map((item, index) => (
              <Draggable
                draggableId={item.id}
                index={index}
                key={item.id}
                isDragDisabled={item.id === 'id-1'} // Disable dragging for 'Lavere hastighed på Fynske Motorvej'
              >
                {(provided) => (
                  <div
                    className={`item-container ${
                      item.id === 'id-1' ? 'grayed-out' : '' // Add a class for styling
                    }`}
                    onClick={() => handleItemClick(item)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                  >
                    <Box
                      size={item.amount}
                      color={item.backgroundColor}
                      name={item.name}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default App;