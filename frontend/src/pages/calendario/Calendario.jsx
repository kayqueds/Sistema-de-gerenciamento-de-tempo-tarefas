import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import "./Calendario.css";
import Sidebar from "../../components/common/sidebar/Sidebar";

function Calendario() {
  const [events, setEvents] = useState([
    // Exemplo inicial, você pode puxar da API depois
    { id: 1, title: "Tarefa Exemplo", start: new Date() },
  ]);

  // Criar nova tarefa clicando em um dia
  const handleDateClick = (info) => {
    const title = prompt("Digite o nome da tarefa:");
    if (title) {
      setEvents([...events, { id: Date.now(), title, start: info.date }]);
    }
  };

  // Mover tarefa para outro dia
  const handleEventDrop = (info) => {
    const updatedEvents = events.map((event) =>
      event.id === parseInt(info.event.id)
        ? { ...event, start: info.event.start }
        : event
    );
    setEvents(updatedEvents);
  };

  // Redimensionar duração da tarefa
  const handleEventResize = (info) => {
    const updatedEvents = events.map((event) =>
      event.id === parseInt(info.event.id)
        ? { ...event, end: info.event.end }
        : event
    );
    setEvents(updatedEvents);
  };

  return (
    <>
    <Sidebar />
    <div className="calendar-container">
      <h2 className="calendar-title">Calendário de Tarefas</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={ptBrLocale}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: "Hoje",
          prev: "Mês Passado",
          next: "Próximo Mês",
          month: "Mês",
          week: "Semana",
          day: "Dia",
        }}
        
        events={events}
        dateClick={handleDateClick}
        editable={true}          // permite arrastar e redimensionar
        selectable={true}        // permite selecionar datas
        selectMirror={true}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        height="80vh"
      />
      
    </div>

    </>
  );
}

export default Calendario;
