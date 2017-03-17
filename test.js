import test from 'ava';
import sinon from 'sinon';
import fn from './';

test.beforeEach(t => {
	t.context.middleware = fn();
	t.context.req = {};
	t.context.res = {
		status: sinon.spy()
	};
});

test('should return a function', t => {
	t.is(typeof t.context.middleware, 'function');
});

test('should expect 3 arguments', t => {
	t.is(t.context.middleware.length, 3);
});

test('should call next() once', t => {
	const next = sinon.spy();

	t.context.middleware(t.context.req, t.context.res, next);

	t.true(next.calledOnce);
});

test('should expose escher instance to request object', t => {
	const FakeEscher = class FakeEscher {
		authenticate() {
			return true;
		}
	};

	const mw = fn({
		Escher: FakeEscher
	});

	mw(t.context.req, t.context.res, () => {
		t.truthy(t.context.req.escher);
		t.true(t.context.req.escher instanceof FakeEscher);
	});
});

test('should instantiate escher with given options', t => {
	const FakeEscher = class FakeEscher {
		constructor(options) {
			this.credentialScope = options.credentialScope;
		}
	};

	const options = {
		Escher: FakeEscher,
		credentialScope: 'example/credential/scope'
	};

	const mw = fn(options);

	mw(t.context.req, t.context.res, () => {
		t.is(t.context.req.escher.credentialScope, options.credentialScope);
	});
});

test('should call escher.authenticate() once', t => {
	const req = {
		escher: {
			authenticate: sinon.spy()
		}
	};

	t.context.middleware(req, t.context.res, () => {
		t.true(req.escher.authenticate.calledOnce);
	});
});

test('should set response status 401 if escher throws', t => {
	const req = {
		escher: {
			authenticate: sinon.stub().throws()
		}
	};

	t.context.middleware(req, t.context.res, () => {
		t.true(t.context.res.status.withArgs(401).calledOnce);
	});
});
