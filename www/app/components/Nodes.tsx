/// <reference path="../References.d.ts"/>
import * as React from 'react';
import * as NodeTypes from '../types/NodeTypes';
import * as ServiceTypes from '../types/ServiceTypes';
import * as CertificateTypes from '../types/CertificateTypes';
import NodesStore from '../stores/NodesStore';
import ServicesStore from '../stores/ServicesStore';
import CertificatesStore from '../stores/CertificatesStore';
import * as NodeActions from '../actions/NodeActions';
import * as ServiceActions from '../actions/ServiceActions';
import * as CertificateActions from '../actions/CertificateActions';
import Node from './Node';
import Page from './Page';
import PageHeader from './PageHeader';

interface State {
	nodes: NodeTypes.NodesRo;
	services: ServiceTypes.ServicesRo;
	certificates: CertificateTypes.CertificatesRo;
	disabled: boolean;
}

const css = {
	header: {
		marginTop: '-19px',
	} as React.CSSProperties,
	heading: {
		margin: '19px 0 0 0',
	} as React.CSSProperties,
};

export default class Nodes extends React.Component<{}, State> {
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			nodes: NodesStore.nodes,
			services: ServicesStore.services,
			certificates: CertificatesStore.certificates,
			disabled: false,
		};
	}

	componentDidMount(): void {
		NodesStore.addChangeListener(this.onChange);
		ServicesStore.addChangeListener(this.onChange);
		CertificatesStore.addChangeListener(this.onChange);
		NodeActions.sync();
		ServiceActions.sync();
		CertificateActions.sync();
	}

	componentWillUnmount(): void {
		NodesStore.removeChangeListener(this.onChange);
		ServicesStore.removeChangeListener(this.onChange);
		CertificatesStore.removeChangeListener(this.onChange);
	}

	onChange = (): void => {
		this.setState({
			...this.state,
			nodes: NodesStore.nodes,
			services: ServicesStore.services,
			certificates: CertificatesStore.certificates,
		});
	}

	render(): JSX.Element {
		let nodesDom: JSX.Element[] = [];

		this.state.nodes.forEach((node: NodeTypes.NodeRo): void => {
			nodesDom.push(<Node
				key={node.id}
				node={node}
				services={this.state.services}
				certificates={this.state.certificates}
			/>);
		});

		return <Page>
			<PageHeader>
				<div className="layout horizontal wrap" style={css.header}>
					<h2 style={css.heading}>Nodes</h2>
					<div className="flex"/>
				</div>
			</PageHeader>
			<div>
				{nodesDom}
			</div>
		</Page>;
	}
}
