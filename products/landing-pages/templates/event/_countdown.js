
(function(){
  // REPLACE THIS with your event date/time (ISO 8601, include the offset).
  // Keep it in the future or the countdown will sit at zero.
  var target = new Date('2027-12-14T09:00:00+05:30').getTime();
  function tick(){
    var diff = Math.max(0, target - Date.now());
    var d = Math.floor(diff/864e5), h = Math.floor(diff%864e5/36e5),
        m = Math.floor(diff%36e5/6e4), s = Math.floor(diff%6e4/1e3);
    document.getElementById('cd-days').textContent = d;
    document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
    document.getElementById('cd-mins').textContent = String(m).padStart(2,'0');
    document.getElementById('cd-secs').textContent = String(s).padStart(2,'0');
  }
  tick(); setInterval(tick, 1000);
})();
