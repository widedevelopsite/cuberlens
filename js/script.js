  // Mobile menu handling
  const hamburger = document.querySelector('.hamburger');
  const navbar = document.querySelector('.nav-links');

  if (hamburger && navbar) {
      hamburger.addEventListener('click', () => {
          hamburger.classList.toggle('active');
          navbar.classList.toggle('active');
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
          if (!navbar.contains(e.target) && !hamburger.contains(e.target)) {
              navbar.classList.remove('active');
              hamburger.classList.remove('active');
          }
      });
  }

  document.addEventListener('DOMContentLoaded', function() {
      // DOM Elements
      const loginModal = document.getElementById('loginModal');
      const signupModal = document.getElementById('signupModal');
      const uploadModal = document.getElementById('uploadModal');
      const adminModal = document.getElementById('adminModal');
      const loginForm = document.getElementById('loginForm');
      const signupForm = document.getElementById('signupForm');
      const loginBtn = document.getElementById('loginBtn');
      const signupBtn = document.getElementById('signupBtn');
      const logoutBtn = document.getElementById('logoutBtn');
      const userProfile = document.getElementById('userProfile');
      const adminLink = document.querySelector('.admin-link');
      const uploadTrigger = document.getElementById('uploadTrigger');
      const fileInput = document.getElementById('fileInput');
      const previewContainer = document.getElementById('previewContainer');
      const confirmUpload = document.getElementById('confirmUpload');

      // Modal Management
      function openModal(modal) {
          if (modal) {
              modal.style.display = 'flex';
              setTimeout(() => modal.classList.add('show'), 10);
              document.body.style.overflow = 'hidden';
          }
      }

      function closeModal(modal) {
          if (modal) {
              modal.classList.remove('show');
              setTimeout(() => {
                  modal.style.display = 'none';
                  document.body.style.overflow = '';
              }, 300);
          }
      }

      // Event Listeners for Modals
      loginBtn.addEventListener('click', () => openModal(loginModal));
      signupBtn.addEventListener('click', () => openModal(signupModal));
      uploadTrigger.addEventListener('click', () => openModal(uploadModal));

      document.querySelectorAll('.close').forEach(btn => {
          btn.addEventListener('click', () => {
              closeModal(btn.closest('.modal'));
          });
      });

      document.querySelectorAll('.modal').forEach(modal => {
          modal.addEventListener('click', (e) => {
              if (e.target === modal) {
                  closeModal(modal);
              }
          });
      });

      // Switch between login and signup
      document.getElementById('switchToSignup').addEventListener('click', (e) => {
          e.preventDefault();
          closeModal(loginModal);
          setTimeout(() => openModal(signupModal), 300);
      });

      document.getElementById('switchToLogin').addEventListener('click', (e) => {
          e.preventDefault();
          closeModal(signupModal);
          setTimeout(() => openModal(loginModal), 300);
      });

      // User Profile Management
      function updateUserProfile(user) {
          const profileName = document.querySelector('.profile-name');
          if (profileName) profileName.textContent = user.name.split(' ')[0];

          // Show/hide admin features
          if (user.role === 'admin') {
              adminLink.style.display = 'block';
          }

          // Animate profile appearance
          userProfile.style.display = 'inline';
      }

      function updateUIForLoggedInUser(user) {
          loginBtn.style.display = 'none';
          signupBtn.style.display = 'none';
          updateUserProfile(user);
      }

      function updateUIForLoggedOutUser() {
          loginBtn.style.display = 'inline-block';
          signupBtn.style.display = 'inline-block';
          userProfile.style.display = 'none';
          adminLink.style.display = 'none';
      }

      // Enhanced Notification System
      function showNotification(message, type) {
          // Remove any existing notifications
          const existingNotifications = document.querySelectorAll('.notification');
          existingNotifications.forEach(notification => notification.remove());

          const notification = document.createElement('div');
          notification.className = `notification ${type}`;
          notification.textContent = message;
          
          // Add icon based on type
          const icon = document.createElement('i');
          icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
          icon.style.marginRight = '100px';
          notification.insertBefore(icon, notification.firstChild);

          document.body.appendChild(notification);

          // Show notification with animation
          notification.style.display = 'block';
          requestAnimationFrame(() => {
              notification.classList.add('show');
          });

          // Remove notification after delay
          setTimeout(() => {
              notification.classList.remove('show');
              setTimeout(() => notification.remove(), 300);
          }, 3000);
      }

      // Authentication Functions
      function createUser(name, email, password) {
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          
          if (users.some(user => user.email === email)) {
              throw new Error('Email already exists');
          }

          const newUser = {
              id: Date.now().toString(),
              name,
              email,
              password: btoa(password), // Basic encryption (not for production)
              role: email === 'admin@admin.com' ? 'admin' : 'user'
          };

          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));
          return newUser;
      }

      function loginUser(email, password) {
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const user = users.find(u => u.email === email && btoa(password) === u.password);
          
          if (!user) {
              throw new Error('Invalid credentials');
          }

          localStorage.setItem('currentUser', JSON.stringify(user));
          return user;
      }

      // Form Submissions
      signupForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const name = document.getElementById('signupName').value;
          const email = document.getElementById('signupEmail').value;
          const password = document.getElementById('signupPassword').value;
          const confirmPassword = document.getElementById('confirmPassword').value;

          try {
              if (password !== confirmPassword) {
                  throw new Error('Passwords do not match');
              }

              await createUser(name, email, password);
              showNotification('Account created successfully! Please login.', 'success');
              closeModal(signupModal);
              setTimeout(() => {
                  openModal(loginModal);
                  // Pre-fill email for convenience
                  document.getElementById('loginEmail').value = email;
              }, 300);
          } catch (error) {
              showNotification(error.message, 'error');
          }
      });

      loginForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = document.getElementById('loginEmail').value;
          const password = document.getElementById('loginPassword').value;

          try {
              const user = await loginUser(email, password);
              closeModal(loginModal);
              
              // Small delay before showing success message and profile
              setTimeout(() => {
                  updateUIForLoggedInUser(user);
                  showNotification('Welcome back, ' + user.name.split(' ')[0] + '! 👋', 'success');
              }, 300);
          } catch (error) {
              showNotification(error.message, 'error');
          }
      });

      // Logout Handler
       logoutBt.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('currentUser');
          updateUIForLoggedOutUser();
          showNotification('You have been logged out successfully! 👋', 'success');
      });

      // Check if user is already logged in
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
          updateUIForLoggedInUser(currentUser);
      }

      // Create default admin account if it doesn't exist
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (!users.some(user => user.email === 'admin@admin.com')) {
          createUser('Admin User', 'admin@admin.com', 'admin123');
      }

      // Gallery Images Data
      const galleryImages = [
         {
            category: 'portrait',
            src: 'IMG-20240120-WA0002.jpg',
            title: 'Cyber Portrait',
            description: 'Hafiz Mubarak Muhammad Siddique'
         },
         {
              category: 'portrait',
              src: '1.jpg',
              title: 'Cyber Portrait',
              description: 'Futuristic portrait photography'
          },
          {
            category: 'portrait',
            src: '2.jpg',
            title: 'Neon City',
            description: 'Urban landscape at night'
        },{
            category: 'portrait',
            src: '3.jpg',
            title: 'Neon Dreams',
            description: 'Cyberpunk aestheti'
        },{
            category: 'portrait',
            src: '4.png',
            title: 'Neon Portrait',
            description: 'Neon-lit portrait session'
        },{
            category: 'portrait',
            src: '5.jpeg',
            title: 'Night City',
            description: 'City lights at twilight'
        },{
            category: 'portrait',
            src: '6.jpg',
            title: 'Digital Art ',
            description: 'Digital art composition'
        },{
            category: 'portrait',
            src: 'https://images.unsplash.com/photo-1493514789931-586cb221d7a7',
            title: 'Night City',
            description: 'City lights at twilight'
        },{
            category: 'portrait',
            src: '8.webp',
            title: 'Modern Architecture',
            description: 'Contemporary urban design'
        },{
            category: 'portrait',
            src: '9.avif',
            title: 'Cyber Portrait',
            description: 'Futuristic portrait photography'
        },{
            category: 'portrait',
            src: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03',
            title: 'Cyber Portrait',
            description: 'Futuristic portrait photography'
        },
          {
              category: 'landscape',
              src: 'https://images.unsplash.com/photo-1559762717-99c81ac85459',
              title: 'Neo City',
              description: 'Urban landscape at night'
          },
          {
              category: 'cyber',
              src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
              title: 'Digital Art',
              description: 'Digital art composition'
          },
          {
              category: 'portrait',
              src: 'https://images.unsplash.com/photo-1542131596-dea5384842c7',
              title: 'Neon Portrait',
              description: 'Neon-lit portrait session'
          },
          {
              category: 'landscape',
              src: '7.jpg',
              title: 'Night City',
              description: 'City lights at twilight'
          },
          {
              category: 'cyber',
              src: 'https://images.unsplash.com/photo-1635830625698-3b9bd74671ca',
              title: 'Studio Light',
              description: 'Professional studio photography'
          },
          
          {
              category: 'landscape',
              src: 'https://images.unsplash.com/photo-1531214159280-079b95d26139',
              title: 'Modern Architecture',
              description: 'Contemporary urban design'
          },
          {
              category: 'cyber',
              src: 'https://images.unsplash.com/photo-1574169208507-84376144848b',
              title: 'Digital Art',
              description: 'Digital art composition'
          },
          {
              category: 'cyber',
              src: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606',
              title: 'Digital Art',
              description: 'Digital art composition'
          },
          {
              category: 'cyber',
              src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
              title: 'Digital Art',
              description: 'Digital art composition'
          },
          {
              category: 'cyber',
              src: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
              title: 'Digital Art',
              description: 'Digital art composition'
          },
          {
            id: 4,
            fileName: 'Forest Path.jpg',
            fileType: 'image/jpeg',
            fileSize: 4500000,
            dataUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
            uploadedAt: new Date(2025, 3, 7).toISOString(),
            userId: 1
          },
          {
            category: 'cyber',
            src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
            title: 'Digital Art',
            description: 'Digital art composition'
        },
      ];

      // Initialize Gallery
      const galleryGrid = document.querySelector('.gallery-grid');

      function createGalleryItem(image) {
          const item = document.createElement('div');
          item.className = 'gallery-item';
          item.setAttribute('data-category', image.category);
          
          item.innerHTML = `
              <div class="item-inner">
                  <img src="${image.src}" alt="${image.title}">
                  <div class="item-overlay">
                      <div class="neon-border"></div>
                      <h3>${image.title}</h3>
                      <p>${image.description}</p>
                  </div>
              </div>
          `;

          return item;
      }

      // Populate Gallery
      galleryImages.forEach(image => {
          galleryGrid.appendChild(createGalleryItem(image));
      });
      // Load uploaded images from localStorage
const storedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
storedImages.forEach(image => {
    galleryGrid.appendChild(createGalleryItem(image));
});

      // Gallery Filter
      const categoryBtns = document.querySelectorAll('.category-btn:not(.upload-btn)');
      categoryBtns.forEach(btn => {
          btn.addEventListener('click', () => {
              const category = btn.getAttribute('data-category');
              
              // Update active button
              categoryBtns.forEach(b => b.classList.remove('active'));
              btn.classList.add('active');

              // Filter gallery items
              document.querySelectorAll('.gallery-item').forEach(item => {
                  if (category === 'all' || item.getAttribute('data-category') === category) {
                      item.style.display = 'block';
                      setTimeout(() => item.style.opacity = '1', 10);
                  } else {
                      item.style.opacity = '0';
                      setTimeout(() => item.style.display = 'none', 300);
                  }
              });
          });
      });

      // File upload preview
      fileInput.addEventListener('change', function() {
          const file = this.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onload = function(e) {
                  previewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                  previewContainer.style.display = 'block';
              };
              reader.readAsDataURL(file);
          }
      });

      // Confirm upload handler
      confirmUpload.addEventListener('click', function() {
          const file = fileInput.files[0];
          if (!file) {
              showNotification('Please select a file to upload', 'error');
              return;
          }

          const reader = new FileReader();
          reader.onload = function(e) {
              // Create new gallery item
              const newImage = {
                  category: 'portrait', // Default category
                  src: e.target.result,
                  title: file.name.split('.')[0],
                  description: 'Uploaded by user'
              };
              // Save to localStorage
        const storedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
        storedImages.push(newImage);
        localStorage.setItem('uploadedImages', JSON.stringify(storedImages));

              galleryGrid.appendChild(createGalleryItem(newImage));
              showNotification('Image uploaded successfully!👋', 'success');
              closeModal(uploadModal);
              
              // Reset upload form
              fileInput.value = '';
              previewContainer.style.display = 'none';
              previewContainer.innerHTML = '';
          };
          reader.readAsDataURL(file);
      });

      // Form animations
      document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
          input.addEventListener('focus', function() {
              this.parentElement.classList.add('active');
          });

          input.addEventListener('blur', function() {
              if (!this.value) {
                  this.parentElement.classList.remove('active');
              }
          });

          // Check if input already has value (e.g., after form submission)
          if (input.value) {
              input.parentElement.classList.add('active');
          }
      });

      // Contact form submission
      document.querySelector('.contact-form').addEventListener('submit', function(e) {
          e.preventDefault();
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;
          const message = document.getElementById('message').value;

          if (!name || !email || !message) {
              showNotification('Please fill out all fields', 'error');
              return;
          }

          // Simulate form submission
          showNotification('Message sent successfully!👋', 'success');
          this.reset();
          document.querySelectorAll('.form-group').forEach(group => {
              group.classList.remove('active');
          });
      });

      // Smooth scrolling for navigation links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function(e) {
              e.preventDefault();
              const target = document.querySelector(this.getAttribute('href'));
              if (target) {
                  window.scrollTo({
                      top: target.offsetTop,
                      behavior: 'smooth'
                  });
              }
              // Close mobile menu if open
              navbar.classList.remove('active');
              hamburger.classList.remove('active');
          });
      });

      // Update active nav link based on scroll position
      window.addEventListener('scroll', function() {
          const scrollPosition = window.scrollY;
          document.querySelectorAll('section').forEach(section => {
              const sectionTop = section.offsetTop - 100;
              const sectionBottom = sectionTop + section.offsetHeight;
              const sectionId = section.getAttribute('id');
              
              if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                  document.querySelectorAll('.nav-links a').forEach(link => {
                      link.classList.remove('active');
                      if (link.getAttribute('href') === `#${sectionId}`) {
                          link.classList.add('active');
                      }
                  });
              }
          });
      });
  });
