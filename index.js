
const min_angle = -44; // 3.9 s
const max_angle = 27; // 1.35 s

const min_frame = 85;
const max_frame = 240;

const start_frame = 20;
const end_frame = 290;

const speed = 0.2;
const refresh_rate = 20 //ms

const _max_frame_jump = 10;

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

const photo = (id) => {

    if (id == 0) id = 1;
    let ret = document.getElementById(`photo_mirror${pad(id, 4)}.png`);
    return ret
}
const placeholder = document.getElementById("placeholder");

let showed_frame = null;
function set_frame(f) {
    if (f == showed_frame) return
    photo(f).style.zIndex = 10;
    if (showed_frame) {
        photo(showed_frame).style.zIndex = 0;
    }
    // console.log(f)
    showed_frame = f;
}

function mouse_move(e) {

    let bodyRect = document.body.getBoundingClientRect();
    let elemRect = placeholder.getBoundingClientRect();
    let offset_y = elemRect.top - bodyRect.top;
    let offset_x = elemRect.left - bodyRect.left;


    let dx = e.pageX - offset_x;
    let dy = e.pageY - offset_y;


    dx -= 170
    dy -= 70

    let a = Math.atan2(dy, dx) * 360 / 2 / Math.PI;
    let d = Math.sqrt(dx * dx + dy * dy);

    if (d < 100 || a > max_angle || a < min_angle) {
        if (goal_sight <= 0.5) goal_sight = 0
        else goal_sight = 1
    } else {
        goal_sight = 1 - (a - min_angle) / (max_angle - min_angle)
    }
    // console.log(a, d)
}

let goal_sight = 1;

function tick() {
    let goal_frame = start_frame;
    if (goal_sight == 0)
        goal_frame = start_frame
    else if (goal_sight == 1)
        goal_frame = end_frame

    else {
        let t = goal_sight;
        goal_frame = min_frame + t * (max_frame - min_frame);
    }
    let new_frame = Math.round(showed_frame + Math.max(-_max_frame_jump, Math.min(_max_frame_jump, (goal_frame - showed_frame) * speed)))
    set_frame(new_frame)
    setTimeout(tick, refresh_rate);
}


document.addEventListener("mousemove", mouse_move);

Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
    setTimeout(() => {
        console.log("everything loaded")
        tick();
        placeholder.style.zIndex = -1
    }, 4000)

}); 