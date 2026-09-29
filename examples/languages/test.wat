(module
  ;; Bump allocator for the wasm half of the image decoder.
  ;; TODO: fall back to memory.grow instead of trapping when the arena is full.

  (import "env" "memory" (memory $mem 2))
  (import "env" "abort" (func $abort (param i32 i32)))

  (global $head (mut i32) (i32.const 1024))
  (global $limit i32 (i32.const 131072))

  (; Block header: [0] payload size in bytes, [1] flags, bit 0 marks a live block.
     FIXME: the flags word is written but nobody ever reads it back.
     The ";;" in the message below is data, not a comment. ;)
  (data (i32.const 0) "oom: arena exhausted ;; aborting\n\00")

  (type $binop (func (param i32 i32) (result i32)))

  (func $align8 (param $n i32) (result i32)
    local.get $n
    i32.const 7
    i32.add
    i32.const -8
    i32.and)

  (func $alloc (export "alloc") (param $size i32) (result i32)
    (local $ptr i32)
    (local.set $ptr (global.get $head))
    (global.set $head (i32.add (local.get $ptr) (call $align8 (local.get $size))))
    (if (i32.gt_u (global.get $head) (global.get $limit))
      (then
        (call $abort (i32.const 0) (i32.const 32))
        unreachable))
    (i32.store offset=0 align=4 (local.get $ptr) (local.get $size))
    (i32.add (local.get $ptr) (i32.const 8)))

  (func $apply (param $fn i32) (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    local.get $fn
    (call_indirect (type $binop)))

  (func $mean (param $ptr i32) (param $len i32) (result f64)
    (local $i i32) (local $acc f64)
    (block $done
      (loop $next
        (br_if $done (i32.ge_u (local.get $i) (local.get $len)))
        (local.set $acc (f64.add (local.get $acc)
          (f64.load (i32.add (local.get $ptr) (i32.shl (local.get $i) (i32.const 3))))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $next)))
    (f64.div (local.get $acc) (f64.convert_i32_u (local.get $len))))

  (func $reset (export "reset") (global.set $head (i32.const 1024)))

  (table 2 funcref)
  (elem (i32.const 0) $align8 $reset)
  (export "mean" (func $mean))
  (start $reset)
)
