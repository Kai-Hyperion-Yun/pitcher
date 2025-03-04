FROM node:18-bullseye

# Install system packages: Python3, pip, Supervisor, cmake, build-essential, and git
RUN apt-get update && \
    apt-get install -y python3 python3-pip supervisor cmake build-essential git && \
    rm -rf /var/lib/apt/lists/*

# Upgrade pip and install streamlit
RUN pip3 install --upgrade pip setuptools wheel && \
    pip3 install --no-cache-dir streamlit

# Create the working directory
WORKDIR /app

# --------------------
# Frontend: Build Node code and install dependencies
# --------------------
# Copy the frontend package files and install dependencies
COPY pitcher-root/frontend/slidev_project/tunnel_pitchdeck/package*.json ./pitcher-root/frontend/slidev_project/tunnel_pitchdeck/
RUN cd pitcher-root/frontend/slidev_project/tunnel_pitchdeck && npm install && npm rebuild esbuild
# Copy the rest of the frontend source code
COPY pitcher-root/frontend/slidev_project/tunnel_pitchdeck/ ./pitcher-root/frontend/slidev_project/tunnel_pitchdeck/
# Build the TypeScript files (which will output to the dist folder)
RUN cd pitcher-root/frontend/slidev_project/tunnel_pitchdeck && npx tsc

# --------------------
# Backend: Install and copy code
# --------------------
COPY pitcher-root/backend/node-image-generator/package*.json ./pitcher-root/backend/node-image-generator/
RUN cd pitcher-root/backend/node-image-generator && npm install
COPY pitcher-root/backend/node-image-generator/ ./pitcher-root/backend/node-image-generator/

# --------------------
# Copy Supervisor configuration file
# --------------------
COPY pitcher-root/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose the ports
# Port 8501 for Streamlit, 3000 for Slidev (if used), 3030 for the backend
EXPOSE 8501 3000 3030

# Start Supervisor, which will manage both Streamlit and the backend processes
CMD ["/usr/bin/supervisord", "-n"]