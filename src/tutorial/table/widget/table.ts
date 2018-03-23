/**
 * 
 */
import { Widget } from '../../../widget/widget';

interface Props {
	data: Data[];
	showData: Data[];
	nameStu: boolean;
	powerStu: boolean;
	nameActive: boolean;
	powerActive: boolean;
}
interface Data {
	name: String;
	power: number;
}

export class Mytable extends Widget {
	public props: Props;

	// 初始化数据
	public create() {
		this.props = {
			data: [
				{ name: 'Chuck Norris', power: Infinity },
				{ name: 'Bruce Lee', power: 9000 },
				{ name: 'Jackie Chan', power: 7000 },
				{ name: 'Jet Li', power: 8000 }
			],
			showData: [
				{ name: 'Chuck Norris', power: Infinity },
				{ name: 'Bruce Lee', power: 9000 },
				{ name: 'Jackie Chan', power: 7000 },
				{ name: 'Jet Li', power: 8000 }
			],
			nameStu: false,
			powerStu: false,
			nameActive: false,
			powerActive: false
		};
	}

	// 按照名字排序
	public sortByName() {
		this.props.nameActive = true;
		this.props.powerActive = false;
		this.props.nameStu = !this.props.nameStu;

		const data = this.props.showData;
		if (this.props.nameStu) {
			const compare = (property) => {
				return (a, b) => {
					const value1 = a[property];
					const value2 = b[property];

					return value2.localeCompare(value1);
				};
			};
			this.props.showData = data.sort(compare('name'));
		} else {
			const compare = (property) => {
				return (a, b) => {
					const value1 = a[property];
					const value2 = b[property];

					return value1.localeCompare(value2);
				};
			};
			this.props.showData = data.sort(compare('name'));
		}
		this.paint();

	}

	// 按照权重排序
	public sortByPower() {
		this.props.nameActive = false;
		this.props.powerActive = true;
		this.props.powerStu = !this.props.powerStu;
		const data = this.props.showData;
		if (this.props.powerStu) {
			const compare = (property) => {
				return (a, b) => {
					const value1 = a[property];
					const value2 = b[property];

					return value2 - value1;
				};
			};
			this.props.showData = data.sort(compare('power'));
		} else {
			const compare = (property) => {
				return (a, b) => {
					const value1 = a[property];
					const value2 = b[property];

					return value1 - value2;
				};
			};
			this.props.showData = data.sort(compare('power'));
		}
		this.paint();
	}

	// 查找
	// tslint:disable-next-line:typedef
	public search(ev) {
		const keyword = ev.target.value;
		this.props.showData = this.props.data.filter((row) => {
			return Object.keys(row).some((key) => {
				return String(row[key]).toLowerCase().indexOf(keyword) > -1;
			});
		});
		this.paint();
	}

}