"""
Flask Backend Application for GCP TechCon 2026
Provides REST APIs for talk searching, category filtering, and HTML template rendering.
"""

from flask import Flask, render_template, jsonify, request
from datetime import datetime
from data import CONFERENCE_INFO, TALKS, BREAKS

app = Flask(__name__)

def filter_talks(search_query=None, category_id=None):
    """Filter talks by search string and/or category ID."""
    results = TALKS
    
    if category_id is not None and str(category_id).isdigit():
        cat_num = int(category_id)
        if cat_num in [1, 2]:
            results = [t for t in results if t["category_id"] == cat_num]
            
    if search_query:
        query = search_query.strip().lower()
        filtered = []
        for talk in results:
            # Match title, description, category
            in_title = query in talk["title"].lower()
            in_desc = query in talk["description"].lower()
            in_cat = query in talk["category"].lower()
            
            # Match speaker names
            in_speaker = any(
                query in s["first_name"].lower() or 
                query in s["last_name"].lower() or 
                query in f"{s['first_name']} {s['last_name']}".lower() or
                query in s["company"].lower()
                for s in talk["speakers"]
            )
            
            if in_title or in_desc or in_cat or in_speaker:
                filtered.append(talk)
        results = filtered
        
    return results


@app.route("/")
def home():
    """Render home page with current date, schedule timetable, and conference metadata."""
    current_date = datetime.now().strftime("%A, %B %d, %Y")
    
    # Merge talks and breaks chronologically for the full schedule timeline
    schedule_timeline = []
    
    # Add breaks with timestamp keys for sorting
    for b in BREAKS:
        schedule_timeline.append({
            "is_talk": False,
            "time": b["time"],
            "data": b
        })
        
    for t in TALKS:
        schedule_timeline.append({
            "is_talk": True,
            "time": t["time"],
            "data": t
        })
        
    return render_template(
        "index.html",
        info=CONFERENCE_INFO,
        talks=TALKS,
        breaks=BREAKS,
        timeline=schedule_timeline,
        current_date=current_date
    )


@app.route("/api/info")
def api_info():
    """API endpoint for conference metadata."""
    return jsonify({
        "status": "success",
        "info": CONFERENCE_INFO,
        "total_talks": len(TALKS),
        "lunch_duration_minutes": 60
    })


@app.route("/api/talks")
def api_talks():
    """
    API endpoint for talks with support for:
    - ?q=<search_term> (searches by category, speaker first/last name, title)
    - ?category=<1|2> (filters by category ID)
    """
    search_q = request.args.get("q", "")
    category = request.args.get("category", None)
    
    filtered = filter_talks(search_query=search_q, category_id=category)
    return jsonify({
        "status": "success",
        "count": len(filtered),
        "query": search_q,
        "category_filter": category,
        "talks": filtered
    })


@app.route("/api/talks/<int:talk_id>")
def api_talk_detail(talk_id):
    """API endpoint for a single talk details."""
    talk = next((t for t in TALKS if t["id"] == talk_id), None)
    if not talk:
        return jsonify({"status": "error", "message": "Talk not found"}), 404
    return jsonify({"status": "success", "talk": talk})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

