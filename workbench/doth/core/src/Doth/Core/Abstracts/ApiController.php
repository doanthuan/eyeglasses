<?php namespace Doth\Core\Abstracts;


abstract class ApiController extends Controller{

	/**
	 * Make standard successful response ['success' => true, 'message' => $message]
	 *
	 * @param string $message Success message
	 * @param object|array $data Data to be send as JSON
	 * @param int $code HTTP response code, default to 200
	 * @return \Illuminate\Http\JsonResponse
	 */
	protected function respondSuccess($message = 'Done!', $data = null, $code = 200)
	{
		return response()->json([
			'success' => true,
			'message' => $message,
			'data' => $data
		], $code);
	}

	/**
	 * Make standard response with error ['success' => false, 'message' => $message]
	 *
	 * @param string $message Error message
	 * @param int $code HTTP response code, default to 500
	 * @return \Illuminate\Http\JsonResponse
	 */
	protected function respondError($message = 'Server error', $code = 500)
	{
		return response()->json([
			'success' => false,
			'message' => $message
		], $code);
	}

	/**
	 * Make standard response with some data
	 *
	 * @param object|array $data Data to be send as JSON
	 * @param int $code optional HTTP response code, default to 200
	 * @return \Illuminate\Http\JsonResponse
	 */
	protected function respondData($data, $code = 200)
	{
		return response()->json($data, $code);
	}
}
