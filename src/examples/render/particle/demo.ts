/**
 *       
 */
import { butil, commonjs } from '../../../lang/mod';
import { Json } from '../../../lang/type';
import { Dimension, FlyControl } from '../../../render3d/fly_control';
import { addSceneRes, configMap, findConfigFile } from '../../../render3d/load';
import { Renderer } from '../../../render3d/renderer';
import { Scene, SceneData } from '../../../render3d/scene';
import { HandlerResult } from '../../../util/event';
import { ResTab } from '../../../util/res_mgr';
import { toJson } from '../../../util/util';
import { Forelet } from '../../../widget/forelet';
import { getRealNode, paintCmd3 } from '../../../widget/painter';
import { loadDir } from '../../../widget/util';
import { Widget } from '../../../widget/widget';
import * as SceneApp from '../../scene';

import { PSCurveMode } from '../../../render3d/particlesystem/curve';
import { GradientMode, PSGradientMode } from '../../../render3d/particlesystem/gradient';
import { PSScalingMode } from '../../../render3d/particlesystem/main';
import { PSAnimationType } from '../../../render3d/particlesystem/texture_sheet_animation';
import { PSSimulationSpace } from '../../../render3d/particlesystem/util';

let camera3DNode;
const resTab = new ResTab();
let scene: Scene;
let renderer: Renderer;
const width = 420;
const height = 700;
let lastMS = 0;
let flyControl;

const copyNode = (node) => {
	const result = JSON.parse(JSON.stringify(node));

	return result;
};

const onRayCast = (event: any) => {
	const result = scene.raycast(event.x, event.y);
	console.log(result);

	return HandlerResult.OK;
};

const render = () => {
	requestAnimationFrame(render);
	const now = new Date().getTime();
	if (lastMS === 0) lastMS = now;
	scene.render((now - lastMS) / 1000);
	lastMS = now;
};

const init = () => {
	const sceneJson = toJson(butil.utf8Decode(configMap.get('examples/render/res/scene/cubep.scene')));

	const sceneData: SceneData = {

		resTab: resTab,

		lights: [{
			type: 'Ambient',
			color: [1, 1, 1]
		}]
	};

	renderer = SceneApp.mgr.createRenderer(width, height, true);
	// let rgb = 71 + 71 * 256 + 71 * 256 ** 2;
	const rgb = 0;
	renderer.setClearColor(rgb, 1);

	scene = SceneApp.mgr.createScene(sceneData, '08scene');

	camera3DNode = scene.getCameraObject();
	if (!camera3DNode) {
		camera3DNode = {
			camera: {
				perspective: [60, width / height, 0.001, 10000]
			},
			transform: {
				position: [0, 0, 20],
				rotate: [0, 3.14159265, 0],
				scale: [1, 1, -1]
			}
		};
		scene.insert(camera3DNode);
	}

	const camera2D = {
		camera: {
			ortho: [-width / 2, width / 2, height / 2, -height / 2, -10000, 10000]
		},
		transform: {
			position: [0, 0, 5],
			rotate: [0, 3.14159265, 0],
			scale: [1, 1, -1]
		}
	};
	scene.insert(camera2D);

	const psConfig = {
		main: {
			duration: 5,
			loop: true,
			prewarm: false,

			startDelay: {
				constant: 1,
				mode: PSCurveMode.Constant
			},
			startDelayMultiplier: 1,

			// startLifetime: {
			//     constant: 3,
			//     mode: PSCurveMode.Constant
			// },
			startLifetime: {
				mode: PSCurveMode.Curve,
				curve: {
					keys: [{
						time: 0,
						value: 0,
						inTangent: 0,
						outTangent: 0
					}, {
						time: 10,
						value: 3,
						inTangent: 0,
						outTangent: 0
					}]
				}
			},
			startLifetimeMultiplier: 1,

			startSpeed: {
				constant: 2,
				mode: PSCurveMode.Constant
			},
			startSpeedMultiplier: 1,

			startSize3D: false,
			startSize: {
				constant: 1,
				mode: PSCurveMode.Constant
			},
			startSizeMultiplier: 1,

			startSizeX: {
				constant: 1,
				mode: PSCurveMode.Constant
			},
			startSizeXMultiplier: 1,

			startSizeY: {
				constant: 1,
				mode: PSCurveMode.Constant
			},
			startSizeYMultiplier: 1,

			startSizeZ: {
				constant: 1,
				mode: PSCurveMode.Constant
			},
			startSizeZMultiplier: 1,

			startRotation3D: false,
			startRotation: {
				constant: 0,
				mode: PSCurveMode.Constant
			},
			startRotationMultiplier: 1,

			startRotationX: {
				constant: 0,
				mode: PSCurveMode.Constant
			},
			startRotationXMultiplier: 1,

			startRotationY: {
				constant: 0,
				mode: PSCurveMode.Constant
			},
			startRotationYMultiplier: 1,

			startRotationZ: {
				constant: 0,
				mode: PSCurveMode.Constant
			},
			startRotationZMultiplier: 1,

			// startColor: {
			//     mode: PSGradientMode.Color,
			//     color: {
			//         a: 255,
			//         r: 255,
			//         g: 255,
			//         b: 255
			//     }
			// },

			startColor: {
				mode: PSGradientMode.Gradient,
				gradient: {
					mode: GradientMode.Blend,
					alphaKeys: [{
						time: 0,
						alpha: 1
					}, {
						time: 1,
						alpha: 1
					}],
					colorKeys: [{
						time: 0,
						r: 0,
						g: 0,
						b: 1
					}, {
						time: 10,
						r: 1,
						g: 1,
						b: 0
					}]
				}
			},

			gravityModifier: {
				constant: 0,
				mode: PSCurveMode.Constant
			},
			gravityModifierMultiplier: 1,

			simulationSpace: PSSimulationSpace.World,
			simulationSpeed: 1,

			scalingMode: PSScalingMode.Local,
			playOnAwake: true,

			randomizeRotationDirection: 0.5,

			maxParticles: 1
		},

		emission: {
			rateOverDistance: {
				mode: PSCurveMode.Constant,
				constant: 0
			},
			rateOverDistanceMultiplier: 1,

			rateOverTime: {
				mode: PSCurveMode.Constant,
				constant: 100
			},
			rateOverTimeMultiplier: 1,

			// {time: , minCount: , maxCount:}
			bursts: []
		},

		// shape: {
		//     alignToDirection: false,
		//     randomDirectionAmount: 1,
		//     sphericalDirectionAmount: 0,

		//     radius: 3,
		//     box: {x: 3, y: 3, z: 3},
		//     // shapeType: 0, // Sphere
		//     // shapeType: 1, // SphereShell
		//     // shapeType: 2, // Hemisphere = 2,
		//     // shapeType: 3, // HemisphereShell = 3,
		//     // shapeType: 5, // Box = 5,
		//     // shapeType: 15, // BoxShell = 15,
		//     shapeType: 16, // BoxEdge = 16
		// },

		// velocityOverLifetime: {
		//     space: PSSimulationSpace.World,
		//     x: {
		//         mode: PSCurveMode.Constant,
		//         constant: 10.0
		//     },
		//     xMultiplier: 1.0,
		//     y: {
		//         mode: PSCurveMode.Constant,
		//         constant: 0.0
		//     },
		//     yMultiplier: 1.0,
		//     z: {
		//         mode: PSCurveMode.Constant,
		//         constant: 0.0
		//     },
		//     zMultiplier: 1.0
		// },

		// forceOverLifetime: {
		//     randomized: false,
		//     space: PSSimulationSpace.World,
		//     x: {
		//         mode: PSCurveMode.Constant,
		//         constant: 10.0
		//     },
		//     xMultiplier: 1.0,
		//     y: {
		//         mode: PSCurveMode.Constant,
		//         constant: 0.0
		//     },
		//     yMultiplier: 1.0,
		//     z: {
		//         mode: PSCurveMode.Constant,
		//         constant: 0.0
		//     },
		//     zMultiplier: 1.0,
		// },

		// limitVelocityOverLifetime: {
		//     dampen: 1.0,
		//     separateAxes: false,

		//     limit: {
		//         mode: PSCurveMode.Constant,
		//         constant: 5.0
		//     },
		//     limitMultiplier: 1.0,

		//     limitX: {
		//         mode: PSCurveMode.Constant,
		//         constant: 0.0
		//     },
		//     limitXMultiplier: 1.0,

		//     limitY: {
		//         mode: PSCurveMode.Constant,
		//         constant: 0.0
		//     },
		//     limitYMultiplier: 1.0,

		//     limitZ: {
		//         mode: PSCurveMode.Constant,
		//         constant: 0.0
		//     },
		//     limitZMultiplier: 1.0
		// },

		// colorOverLifetime: {
		//     color: {
		//         mode: PSGradientMode.Gradient,
		//         gradient: {
		//             mode: GradientMode.Blend,
		//             alphaKeys: [{
		//                 time: 0,
		//                 alpha: 1
		//             }, {
		//                 time: 1,
		//                 alpha: 1
		//             }],
		//             colorKeys: [{
		//                 time: 0,
		//                 r: 1,
		//                 g: 0,
		//                 b: 0
		//             }, {
		//                 time: 1,
		//                 r: 0,
		//                 g: 1,
		//                 b: 0
		//             }]
		//         }
		//     }
		// },

		// sizeOverLifetime: {
		//     separateAxes: false,
		//     size: {
		//         mode: PSCurveMode.Curve,
		//         curve: {
		//             keys: [{
		//                 time: 0,
		//                 value: 0,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }, {
		//                 time: 1,
		//                 value: 1,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }]
		//         }
		//     },
		//     sizeMultiplier: 1.0,
		//     x: {
		//         mode: PSCurveMode.Curve,
		//         curve: {
		//             keys: [{
		//                 time: 0,
		//                 value: 0,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }, {
		//                 time: 1,
		//                 value: 1,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }]
		//         }
		//     },
		//     xMultiplier: 1.0,
		//     y: {
		//         mode: PSCurveMode.Curve,
		//         curve: {
		//             keys: [{
		//                 time: 0,
		//                 value: 0,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }, {
		//                 time: 1,
		//                 value: 1,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }]
		//         }
		//     },
		//     yMultiplier: 1.0,
		//     z: {
		//         mode: PSCurveMode.Curve,
		//         curve: {
		//             keys: [{
		//                 time: 0,
		//                 value: 0,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }, {
		//                 time: 1,
		//                 value: 1,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }]
		//         }
		//     },
		//     zMultiplier: 1.0
		// },

		// rotationOverLifetime: {
		//     separateAxes: false,
		//     x: {
		//         mode: PSCurveMode.Curve,
		//         curve: {
		//             keys: [{
		//                 time: 0,
		//                 value: 0,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }, {
		//                 time: 1,
		//                 value: 1,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }]
		//         }
		//     },
		//     xMultiplier: 1.0,
		//     y: {
		//         mode: PSCurveMode.Curve,
		//         curve: {
		//             keys: [{
		//                 time: 0,
		//                 value: 0,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }, {
		//                 time: 1,
		//                 value: 1,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }]
		//         }
		//     },
		//     yMultiplier: 1.0,
		//     z: {
		//         mode: PSCurveMode.Curve,
		//         curve: {
		//             keys: [{
		//                 time: 0,
		//                 value: 0,
		//                 inTangent: Math.PI,
		//                 outTangent: Math.PI,
		//             }, {
		//                 time: 1,
		//                 value: 3 * Math.PI,
		//                 inTangent: 3 * Math.PI,
		//                 outTangent: 3 * Math.PI,
		//             }]
		//         }
		//     },
		//     zMultiplier: 1.0
		// },

		// colorBySpeed: {
		//     range: {
		//         x: 0,
		//         y: 100
		//     },
		//     color: {
		//         mode: PSGradientMode.Gradient,
		//         gradient: {
		//             mode: GradientMode.Blend,
		//             alphaKeys: [{
		//                 time: 0,
		//                 alpha: 1
		//             }, {
		//                 time: 1,
		//                 alpha: 1
		//             }],
		//             colorKeys: [{
		//                 time: 0,
		//                 r: 1,
		//                 g: 0,
		//                 b: 0
		//             }, {
		//                 time: 1,
		//                 r: 0,
		//                 g: 1,
		//                 b: 0
		//             }]
		//         }
		//     }
		// },
		// sizeBySpeed: {
		//     range: { x: 0, y: 10 },
		//     separateAxes: false,
		//     size: {
		//         mode: PSCurveMode.Curve,
		//         curve: {
		//             keys: [{
		//                 time: 0,
		//                 value: 0,
		//                 inTangent: 30,
		//                 outTangent: 30,
		//             }, {
		//                 time: 1,
		//                 value: 30,
		//                 inTangent: 30,
		//                 outTangent: 30,
		//             }]
		//         }
		//     },
		//     sizeMultiplier: 1.0,
		//     x: {
		//         mode: PSCurveMode.Curve,
		//         curve: {
		//             keys: [{
		//                 time: 0,
		//                 value: 0,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }, {
		//                 time: 1,
		//                 value: 1,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }]
		//         }
		//     },
		//     xMultiplier: 1.0,
		//     y: {
		//         mode: PSCurveMode.Curve,
		//         curve: {
		//             keys: [{
		//                 time: 0,
		//                 value: 0,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }, {
		//                 time: 1,
		//                 value: 1,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }]
		//         }
		//     },
		//     yMultiplier: 1.0,
		//     z: {
		//         mode: PSCurveMode.Curve,
		//         curve: {
		//             keys: [{
		//                 time: 0,
		//                 value: 0,
		//                 inTangent: Math.PI,
		//                 outTangent: Math.PI,
		//             }, {
		//                 time: 1,
		//                 value: 3 * Math.PI,
		//                 inTangent: 3 * Math.PI,
		//                 outTangent: 3 * Math.PI,
		//             }]
		//         }
		//     },
		//     zMultiplier: 1.0
		// },
		// rotationBySpeed: {
		//     range: { x: 0, y: 100 },
		//     separateAxes: false,
		//     x: {
		//         mode: PSCurveMode.Curve,
		//         curve: {
		//             keys: [{
		//                 time: 0,
		//                 value: 0,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }, {
		//                 time: 1,
		//                 value: 1,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }]
		//         }
		//     },
		//     xMultiplier: 1.0,
		//     y: {
		//         mode: PSCurveMode.Curve,
		//         curve: {
		//             keys: [{
		//                 time: 0,
		//                 value: 0,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }, {
		//                 time: 1,
		//                 value: 1,
		//                 inTangent: 1,
		//                 outTangent: 1,
		//             }]
		//         }
		//     },
		//     yMultiplier: 1.0,
		//     z: {
		//         mode: PSCurveMode.Curve,
		//         curve: {
		//             keys: [{
		//                 time: 0,
		//                 value: 0,
		//                 inTangent: Math.PI,
		//                 outTangent: Math.PI,
		//             }, {
		//                 time: 1,
		//                 value: 5 * Math.PI,
		//                 inTangent: 5 * Math.PI,
		//                 outTangent: 5 * Math.PI,
		//             }]
		//         }
		//     },
		//     zMultiplier: 1.0
		// },

		textureSheetAnimation: {
			cycleCount: 1,
			// frameOverTime: {
			//     constant: 0.0,
			//     mode: PSCurveMode.Constant
			// },
			frameOverTime: {
				mode: PSCurveMode.Curve,
				curve: {
					keys: [{
						time: 0,
						value: 0,
						inTangent: 6,
						outTangent: 6
					}, {
						time: 1,
						value: 6,
						inTangent: 6,
						outTangent: 6
					}]
				}
			},
			frameOverTimeMultiplier: 1,
			numTilesX: 2,
			numTilesY: 3,
			startFrame: {
				constant: 2,
				mode: PSCurveMode.Constant
			},
			startFrameMultiplier: 1,

			animation: PSAnimationType.WholeSheet,
			rowIndex: 2,
			useRandomRow: false
		},

		renderer: {
			geometry: {
				type: 'BufferGeometry',
				res: 'DSjYAoSa5YX9f3kxNqtYzA.geo'
			},
			meshRender: {
				material: [
					{
						type: 'MeshBasicMaterial',
						map: {
							wrap: [
								1001,
								1001
							],
							filter: [
								1006,
								1007
							],
							generateMipmaps: true,
							image: {
								name: 'num123456.png'
							}
						},
						transparent: true,
						layer: 3000
					}
				]
			}
		}
	};

	const ps = {
		position: [0, 0, 0],
		particlesystem: psConfig
	};
	scene.insert(sceneJson, undefined, resTab);

	flyControl = new FlyControl(camera3DNode.ref.impl, 0.2, 0.1, { size: [width, height], offset: [0, 0] });

	render();

	const delta = 0.1;
	setInterval(() => {
		// if (ps.position[0] < 0 || ps.position[0] > 2) {
		//     delta = -delta;
		// }
		// ps.position[0] += delta;

		// scene.modify(ps, ["position"]);
	}, 50);

	/**
	 * 键盘事件必须放到window或者有焦点的元素上
	 */
	forelet.addHandler(
		'onMouseDown',
		(event) => {
			flyControl.onMouseLDown.call(flyControl, event);
			flyControl.onMouseMDown.call(flyControl, event);

			return 0;
		}
	);
	forelet.addHandler(
		'onMouseMove',
		(event) => {
			flyControl.onMouseLMove.call(flyControl, event);
			flyControl.onMouseMMove.call(flyControl, event);

			return 0;
		}
	);
	forelet.addHandler('onMouseWheel', flyControl.onMouseWheel.bind(flyControl));

	forelet.addHandler('onRayCast', onRayCast);

};

let isLoad;
let isFirstPaint;
let widget;

/**
 * 两个条件都准备好了，才能进行初始化
 */
const initScene = () => {
	if (isLoad && isFirstPaint) {
		init();
		const canvas = renderer.getCanvas();
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		paintCmd3(getRealNode(widget.tree), 'appendChild', [canvas]);
	}
};

loadDir(['examples/render/res/'], commonjs.flags, {}, { png: 'download', jpg: 'download' }, fileMap => {
	isLoad = true;
	addSceneRes(fileMap, 'examples/render/res/');
	initScene();
}, null, null);

export const forelet = new Forelet();

forelet.listener = (cmd: string, w: Widget): void => {
	if (cmd === 'firstPaint') {
		widget = w;
		isFirstPaint = true;
		initScene();
	}
};