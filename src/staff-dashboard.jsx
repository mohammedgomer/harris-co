import { useState, useEffect } from "react";

const API = 'http://localhost:3001';
const SOLICITORS = [
  { id: 1, name: "Harris Zafar", photo: "HZ" },
  { id: 2, name: "Maheen Bijarani", photo: "MB" },
  { id: 3, name: "Mohammed Usman", photo: "MU" },
  { id: 4, name: "Stephen Benson", photo: "SB" },
  { id: 5, name: "Usama Ali", photo: "UA" },
];
const TIME_SLOTS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'];

function toDateKey(d) { return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }
function formatDateFull(d) { return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }
function getNext14Days() { const d = []; const n = new Date(); for (let i = 0; i <= 14; i++) { const x = new Date(n); x.setDate(x.getDate() + i); if (x.getDay() !== 0 && x.getDay() !== 6) d.push(x); } return d; }

export default function StaffDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const dates = getNext14Days();

  useEffect(() => {
    fetch(API + '/api/bookings?date=' + toDateKey(selectedDate))
      .then(r => r.json())
      .then(d => setBookings(d.bookings || []))
      .catch(() => setBookings([]));
  }, [selectedDate]);

  useEffect(() => {
    fetch(API + '/api/status')
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {});
  }, []);

  const getBookingForSlot = (solicitorId, time) => {
    return bookings.find(b => b.solicitorId === solicitorId && b.time === time && b.status === 'active');
  };

  return (
    <div style={{ fontFamily: "'Source Sans 3', sans-serif", minHeight: "100vh", background: "#f5f5f5" }}>
      <style>{`@import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Source+Sans+3:wght@300;400;500;600;700&display=swap");`}</style>
      
      {/* Header */}
      <div style={{ background: "#1a1a1a", borderBottom: "3px solid #f9e2a8", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#f9e2a8" }}>Harris & Co Solicitors</div>
          <span style={{ background: "#f9e2a8", color: "#1a1a1a", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>STAFF</span>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#999" }}>
          {stats && (<>
            <span>📊 {stats.activeBookings} active bookings</span>
            <span>📅 Calendar: {stats.googleCalendar}</span>
            <span>📧 Email: {stats.email}</span>
          </>)}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "24px auto", padding: "0 24px" }}>
        {/* Date selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {dates.map((d, i) => {
            const isToday = d.toDateString() === new Date().toDateString();
            const isSelected = d.toDateString() === selectedDate.toDateString();
            return (
              <div key={i} onClick={() => setSelectedDate(d)} style={{
                padding: "10px 16px", borderRadius: 8, cursor: "pointer", textAlign: "center", minWidth: 80,
                border: isSelected ? "2px solid #f9e2a8" : "1px solid #e0d6c2",
                background: isSelected ? "#fdf6e3" : "#fff",
                boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,.1)" : "none"
              }}>
                <div style={{ fontSize: 11, color: "#999", fontWeight: 500 }}>{d.toLocaleDateString("en-GB",{weekday:"short"})}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>{d.getDate()}</div>
                <div style={{ fontSize: 10, color: "#999" }}>{d.toLocaleDateString("en-GB",{month:"short"})}</div>
                {isToday && <div style={{ fontSize: 9, color: "#f9e2a8", fontWeight: 700, marginTop: 2 }}>TODAY</div>}
              </div>
            );
          })}
        </div>

        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#1a1a1a", marginBottom: 4 }}>{formatDateFull(selectedDate)}</h2>
        <p style={{ color: "#999", fontSize: 14, marginBottom: 20 }}>
          {bookings.filter(b => b.status === 'active').length} booking(s) on this day
        </p>

        {/* Calendar grid */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e0d6c2", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "80px " + SOLICITORS.map(() => "1fr").join(" "), borderBottom: "2px solid #e0d6c2" }}>
            <div style={{ padding: 12, fontWeight: 600, fontSize: 13, color: "#999", borderRight: "1px solid #e0d6c2" }}>Time</div>
            {SOLICITORS.map(s => (
              <div key={s.id} style={{ padding: 12, textAlign: "center", borderRight: "1px solid #e0d6c2" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1a1a1a", color: "#f9e2a8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", fontWeight: 700, fontSize: 13 }}>{s.photo}</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#1a1a1a" }}>{s.name.split(' ')[0]}</div>
              </div>
            ))}
          </div>

          {/* Time rows */}
          {TIME_SLOTS.map(time => (
            <div key={time} style={{ display: "grid", gridTemplateColumns: "80px " + SOLICITORS.map(() => "1fr").join(" "), borderBottom: "1px solid #f0ebe1" }}>
              <div style={{ padding: "10px 12px", fontWeight: 600, fontSize: 13, color: "#1a1a1a", borderRight: "1px solid #e0d6c2", display: "flex", alignItems: "center" }}>{time}</div>
              {SOLICITORS.map(s => {
                const booking = getBookingForSlot(s.id, time);
                return (
                  <div key={s.id} onClick={() => booking && setSelectedBooking(booking)} style={{
                    padding: 6, borderRight: "1px solid #f0ebe1", cursor: booking ? "pointer" : "default", minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {booking ? (
                      <div style={{
                        background: booking.parentCategory === 'Criminal' ? '#fef3cd' : booking.parentCategory === 'Motoring' ? '#d1ecf1' : '#d4edda',
                        border: "1px solid " + (booking.parentCategory === 'Criminal' ? '#f9e2a8' : booking.parentCategory === 'Motoring' ? '#bee5eb' : '#c3e6cb'),
                        borderRadius: 6, padding: "4px 8px", width: "100%", fontSize: 11
                      }}>
                        <div style={{ fontWeight: 700, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{booking.clientName}</div>
                        <div style={{ color: "#666", fontSize: 10 }}>{booking.subcategory}</div>
                      </div>
                    ) : (
                      <div style={{ color: "#ddd", fontSize: 11 }}>—</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Booking detail modal */}
        {selectedBooking && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setSelectedBooking(null)}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 28, maxWidth: 500, width: "100%", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#1a1a1a" }}>Booking Details</h3>
                <span style={{ background: selectedBooking.status === 'active' ? '#d4edda' : '#fceaea', color: selectedBooking.status === 'active' ? '#2e7d52' : '#b33a3a', padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>{selectedBooking.status}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
                {[
                  ["Reference", selectedBooking.ref],
                  ["Client", selectedBooking.clientName],
                  ["Email", selectedBooking.clientEmail],
                  ["Phone", selectedBooking.clientPhone],
                  ["Case", selectedBooking.parentCategory + " — " + selectedBooking.subcategory],
                  ["Type", selectedBooking.consultationType === 'walk-in' ? 'Walk-in' : 'Phone'],
                  ["Solicitor", selectedBooking.solicitor],
                  ["Date", selectedBooking.date],
                  ["Time", selectedBooking.time],
                  ["Paid", "£" + selectedBooking.total],
                  ["Files", selectedBooking.fileCount + " uploaded"],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0ebe1" }}>
                    <span style={{ color: "#999" }}>{label}</span>
                    <span style={{ fontWeight: 600, color: "#1a1a1a", textAlign: "right", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis" }}>{val}</span>
                  </div>
                ))}
              </div>
              {selectedBooking.description && (
                <div style={{ marginTop: 16, padding: 12, background: "#fdf6e3", borderRadius: 8, fontSize: 13, color: "#666" }}>
                  <strong>Case Description:</strong> {selectedBooking.description}
                </div>
              )}
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button onClick={() => setSelectedBooking(null)} style={{ flex: 1, padding: "10px 16px", background: "#f5f5f5", border: "1px solid #e0d6c2", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Close</button>
                {selectedBooking.status === 'active' && (
                  <button onClick={() => {
                    if (confirm('Cancel this booking? The slot will be freed up.')) {
                      fetch(API + '/api/bookings/cancel', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ref: selectedBooking.ref, name: selectedBooking.clientName })
                      }).then(r => r.json()).then(() => {
                        setSelectedBooking(null);
                        fetch(API + '/api/bookings?date=' + toDateKey(selectedDate)).then(r => r.json()).then(d => setBookings(d.bookings || []));
                      });
                    }
                  }} style={{ flex: 1, padding: "10px 16px", background: "#b33a3a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Cancel Booking</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
