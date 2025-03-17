document.addEventListener('DOMContentLoaded', function() {
    const calendarContainer = document.getElementById('post-calendar');
    if (!calendarContainer) return;
  
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
  
    // Get list of post dates from data attribute
    const postDates = JSON.parse(calendarContainer.getAttribute('data-post-dates') || '[]');
    
    // Initialize calendar
    renderCalendar(currentMonth, currentYear, postDates);
  
    // Previous month button
    document.getElementById('prev-month').addEventListener('click', function() {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar(currentMonth, currentYear, postDates);
    });
  
    // Next month button
    document.getElementById('next-month').addEventListener('click', function() {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar(currentMonth, currentYear, postDates);
    });
  
    // Function to render the calendar
    function renderCalendar(month, year, postDates) {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      
      const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
      
      // Get first day and last date of month
      const firstDay = new Date(year, month, 1).getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();
      
      // Previous month's last date
      const prevMonthLastDate = new Date(year, month, 0).getDate();
      
      // Update header
      document.getElementById('calendar-month-year').textContent = monthNames[month] + ' ' + year;
      
      // Create calendar grid
      let calendarHTML = '<table class="calendar-table">';
      
      // Add days header
      calendarHTML += '<tr>';
      for (let i = 0; i < dayNames.length; i++) {
        calendarHTML += `<th>${dayNames[i]}</th>`;
      }
      calendarHTML += '</tr>';
      
      // Add date cells
      let date = 1;
      for (let i = 0; i < 6; i++) {
        // Stop if we've already displayed all days
        if (date > lastDate) break;
        
        calendarHTML += '<tr>';
        
        for (let j = 0; j < 7; j++) {
          if (i === 0 && j < firstDay) {
            // Display previous month's dates
            const prevDate = prevMonthLastDate - (firstDay - j) + 1;
            calendarHTML += `<td class="other-month">${prevDate}</td>`;
          } else if (date > lastDate) {
            // Display next month's dates
            const nextDate = date - lastDate;
            calendarHTML += `<td class="other-month">${nextDate}</td>`;
            date++;
          } else {
            // Check if current date has posts
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
            const hasPost = postDates.includes(dateStr);
            
            // Current date classes
            let classes = [];
            if (hasPost) classes.push('has-post');
            
            // Current day highlight
            const now = new Date();
            if (date === now.getDate() && month === now.getMonth() && year === now.getFullYear()) {
              classes.push('current-day');
            }
            
            // Create date cell with appropriate classes and data
            const classAttr = classes.length ? ` class="${classes.join(' ')}"` : '';
            calendarHTML += `<td${classAttr} data-date="${dateStr}">${date}</td>`;
            
            date++;
          }
        }
        
        calendarHTML += '</tr>';
      }
      
      calendarHTML += '</table>';
      
      // Update calendar
      document.getElementById('calendar-grid').innerHTML = calendarHTML;
      
      // Add click event to date cells with posts
      const dateCells = document.querySelectorAll('.has-post');
      dateCells.forEach(cell => {
        cell.addEventListener('click', function() {
          const selectedDate = this.getAttribute('data-date');
          filterPostsByDate(selectedDate);
        });
      });
    }
  
    // Function to filter posts by selected date
    function filterPostsByDate(dateStr) {
      // Show all posts initially
      const allPosts = document.querySelectorAll('.post-item');
      allPosts.forEach(post => {
        post.style.display = 'list-item';
      });
      
      // If a date is selected, filter posts
      if (dateStr) {
        allPosts.forEach(post => {
          const postDate = post.getAttribute('data-date');
          if (postDate !== dateStr) {
            post.style.display = 'none';
          }
        });
        
        // Update filter indicator
        const filterIndicator = document.getElementById('date-filter-indicator');
        if (filterIndicator) {
          filterIndicator.textContent = `Filtered by: ${dateStr}`;
          filterIndicator.style.display = 'block';
        }
      } else {
        // Clear filter indicator
        const filterIndicator = document.getElementById('date-filter-indicator');
        if (filterIndicator) {
          filterIndicator.style.display = 'none';
        }
      }
    }
    
    // Reset filter button
    const resetButton = document.getElementById('reset-filter');
    if (resetButton) {
      resetButton.addEventListener('click', function() {
        filterPostsByDate(null);
      });
    }
  });