import streamlit as st
import subprocess
import time
import os

st.title("Pitch Deck Generator")

st.write(
    "Upload your screenplay JSON file to generate a slides.md and preview it using Slidev."
)

# 1. File uploader widget
uploaded_file = st.file_uploader("Upload your screenplay metadata JSON", type="json")
if uploaded_file is not None:
    file_path = "bad-ass-girls.json"
    with open(file_path, "wb") as f:
        f.write(uploaded_file.getbuffer())
    st.success("File uploaded successfully!")
    

    # 2. Generate slides.md by running Node script (main.js)
    st.info("Generating slides.md...")
    result = subprocess.run(["node", "dist/main.js"], capture_output=True, text=True)
    st.write("Node output:", result.stdout)
    if result.stderr:
        st.error(f"Node errors: {result.stderr}")
    else:
        st.success("Slides generated successfully!")
        
        
    # 3. (optional) display the generated slides.md contents
    if os.path.exists("slides.md"):
        with open("slides.md", "r") as f:
            slides_contents = f.read()
            
        st.text_area("Generated slides.md", slides_contents, height=300)
    
    # 4. Start the Slidev dev server in the background to preview slides
    st.info("Starting Slidev preview...")
    # Launch the Slidev process (it should persist as a server)
    slidev_proc = subprocess.Popen(
        ["npx", "@slidev/cli", "dev","--", "slides.md"],
        cwd="/app/pitcher-root/frontend/slidev_project/tunnel_pitchdeck",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    # Wait a bit for the server to start
    time.sleep(15)

    # Check if the process is still running
    if slidev_proc.poll() is None:
         st.success("Slidev server started!")
         st.markdown(
             'Open your slides [here](http://localhost:3000) (if you are running this locally).'
         )
    else:
         stdout, stderr = slidev_proc.communicate()
         st.error("Slidev server failed to start.")
         if stderr:
             st.error(stderr.decode("utf-8"))
    
    st.write(
        "If running on a remote server, you may need to expose port 3000 via appropriate networking or reverse-proxy setting"
    )