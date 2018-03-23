
#[path=../../ecs/]
use world::{Component};
#[extends=Component]
struct Tansfrom{
    position:Vector,
    rotation:Vector,
    scale:Vector,
}

struct Vector{
    value:(f32,f32,f32),
}
