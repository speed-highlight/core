class_name Player
extends CharacterBody2D

## Side scroller player: walk, jump, take damage.
# TODO: double jump is not wired yet, extends and signal stay as is

signal health_changed(amount: int)

const MAX_HEALTH := 100
const GRAVITY := 980.0
const HURT_SOUND = preload("res://sfx/hurt.ogg")
const HELP_TEXT := """
Arrows to move, space to jump.
If not on the floor you can still jump for a moment.
Build #42 - report bugs to the studio.
"""

@export var speed: float = 220.0
@export_range(0.0, 1.0) var friction := 0.15
@export var invincible: bool = false

@onready var sprite: AnimatedSprite2D = $Visuals/AnimatedSprite2D
@onready var label := %HealthLabel

enum State { IDLE, RUN, JUMP }
var state: State = State.IDLE
var health := MAX_HEALTH
var _coyote := 0.0


func _ready() -> void:
	$HurtBox.body_entered.connect(_on_hit)
	label.text = "HP %d/%d" % [health, MAX_HEALTH]
	print("loaded # not a comment, still a string")


func _physics_process(delta: float) -> void:
	if not is_on_floor():
		velocity.y += GRAVITY*delta
		_coyote = maxf(_coyote-delta, 0.0)
	else:
		_coyote = 0.12

	var dir := Input.get_axis('move_left', 'move_right')
	velocity.x = lerpf(velocity.x, dir*speed, friction)
	if Input.is_action_just_pressed("jump") and _coyote > 0.0:
		velocity.y = -420.0

	match state:
		State.RUN when is_zero_approx(dir):
			state = State.IDLE
		_:
			sprite.play(&"idle")
	move_and_slide()


func _on_hit(body: Node2D) -> void:
	if invincible or not (body is Enemy):
		return
	health = clampi(health-body.damage, 0, MAX_HEALTH)
	health_changed.emit(health)
	if health == 0:
		await get_tree().create_timer(0.5).timeout
		queue_free()
